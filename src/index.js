const { app, BrowserWindow, ipcMain, electron } = require('electron');
const killBrowsers = require('./helpers/kill_browsers');
const test = require('./helpers/test_helper');
const settings = require('./settings');
const mongoose = require('mongoose');
const queries = require('./db/queries');
const os = require('os');
const path = require('path');

require('electron-reload')(__dirname);
const unhandled = require('electron-unhandled');
unhandled();

if (require('electron-squirrel-startup')) {
  app.quit();
}

require('dotenv').config();

let window;
let jobs;
let width = 800;
let height = 600;
let canQuitApp = false;

const executeJobs = () => {
  killBrowsers.execute();
  test.execute();
}

const showSurvey = (url, user) => {
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true,
    frame: false,
    fullscreen: true
  });
  ipcMain.on('survey-request-data', (e, args) => {
    e.reply('survey-request-data-reply', {
      url: url,
      user: user
    })
  })
  ipcMain.on('filled-survey', async(e, args) => {
    console.log('User has filled survey: ', args, user);
    await queries.updateSurveyStatus(user, true);
    console.log('User survey state was updated to: TRUE');
    e.reply('survey-state-to-true', {});
  })
  window.loadFile(path.join(__dirname, 'pages', `${settings.PAGES.surveyPage}.html`));
  window.on('close', () => {
    app.quit();
  })
}

const showSurveyOrClose = async (userName, userDomain, APP_PREFERENCES) => {
  const user = await queries.getUser(userName, userDomain);
  console.log('User obtained on show survey before: ', user);
  if (APP_PREFERENCES.showSurvey) {
    if (!user.hasFilledSurvey) {
      if (user.domain.toLowerCase() === "intec") {
        showSurvey(APP_PREFERENCES.studentUrl, user);
      } else {
        showSurvey(APP_PREFERENCES.teacherUrl, user);
      }
    } else {
      canQuitApp = true;
      app.quit();
    }
  } else {
    canQuitApp = true;
    app.quit();
  }
}

const showReminder = (user, APP_PREFERENCES) => {
  window = new BrowserWindow({
    width: 1100,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true,
    frame: false,
    resizable: false
  });
  ipcMain.on('rulesReminder-window-data-request', (event, arg) => {
    event.reply('rulesReminder-window-data', {
      customText: APP_PREFERENCES.reminderText
    })
  });
  window.loadFile(path.join(__dirname, 'pages', `${settings.PAGES.reminderPage}.html`));
  // window.webContents.openDevTools();
  window.on('close', () => {
    console.log('You have closed reminder window');
    showSurveyOrClose(user.intecId, user.domain, APP_PREFERENCES);
  })
}

const showRules = async (userName, userDomain, trimester, APP_PREFERENCES) => {
  const RULES = await queries.getRules();
  const SUBJECTS = await queries.getSubjects();
  window = new BrowserWindow({
    width: 1100,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    fullscreen: true
  });
  ipcMain.on('rules-window-data-request', (event, arg) => {
    event.reply('rules-window-data',{
      rules: RULES,
      subjects: SUBJECTS,
      user: {
        username: userName,
        domain: userDomain
      },
      trimester: trimester
    })
  });
  window.loadFile(path.join(__dirname, 'pages', `${settings.PAGES.rulesPage}.html`));
  window.on('close', () => {
    console.log('You have closed rules window');
    showSurveyOrClose(userName, userDomain, APP_PREFERENCES);
  });
}

app.on('ready', async () => {

  // connect to DB
  require('./helpers/connect_db')
  // Seed data if needed
  require('./db/seed');

  // get user info
  let userDomain = process.env.USERDOMAIN || "intec";
  let userName = process.env.USERNAME || os.userInfo().username;

  // Get Blacklist users
  const blackListedUsers = await queries.getBlackListUsers();
  const isUserBlackListed = blackListedUsers.find(u => u.intecId.toLowerCase() === userName.toLowerCase());

  if (isUserBlackListed) {
    // Stop execution of the program.
    console.log('You are blacklisted, so the program will close.');
    app.quit();
    return;
  }
  
  // get configs
  const configs = await queries.getConfigs();

  const currentTrimester = await queries.getCurrentTrimester();

  const APP_PREFERENCES = {
    fullscreen: configs.find(cfg => cfg.key === settings.CONFIGS.isFullscreen).value,
    showSurvey: configs.find(cfg => cfg.key === settings.CONFIGS.showSurvey).value,
    studentUrl: configs.find(cfg => cfg.key === settings.CONFIGS.studentUrl).value,
    teacherUrl: configs.find(cfg => cfg.key === settings.CONFIGS.teacherUrl).value,
    reminderText: configs.find(cfg => cfg.key === settings.CONFIGS.reminderText).value,
  }

  const USERS = (userDomain.toLowerCase() === "intec") ? await queries.getStudentInCurrentTrimester(currentTrimester[0], userName) : await queries.getTeacherInCurrentTrimester(currentTrimester[0], userName);
  const USER = USERS[0];

  console.log("CURRENT STUDENT", USER);
  if (!USER) {
    showRules(userName, userDomain, currentTrimester[0], APP_PREFERENCES);
  } else {
    console.log(USER);
    showReminder(USER, APP_PREFERENCES);
  }
  
  // Execute this code to Close any browser. So user first completes this process and then,
  //  can use the computer.
  // jobs = setInterval(() => {
  //   executeJobs();
  // }, 5000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && canQuitApp) {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow(settings.PAGES.startPage, true);
  }
});

ipcMain.on('add-student-to-history', async (event, args) => {
  console.log('Acceptting rules...', args);
  console.log('trimester id: ', args.trimester._id.id);
  if (args.userDomain.toLowerCase() === "intec") {
    await queries.addStudent({
      name: args.userName,
      intecId: args.userName,
      fullName: args.userName,
      computer: os.hostname(),
      room: '',
      createdAt: Date.now(),
      teacher: (!!args.selectedData && !!args.selectedData.teacher) ? args.selectedData.teacher : '',
      subject: (!!args.selectedData && !!args.selectedData.subject) ? args.selectedData.subject : '',
      section: (!!args.selectedData && !!args.selectedData.section && !!args.selectedData.section != 0) ? args.selectedData.section : '',
      trimesterName: args.trimester.name,
      trimesterId: mongoose.Types.ObjectId(args.trimester._id.id),
      domain: args.userDomain,
      hasFilledSurvey: false
    });
  } else {
    await queries.addTeacher({
      name: args.userName,
      intecId: args.userName,
      fullName: args.userName,
      computer: os.hostname(),
      room: '',
      createdAt: Date.now(),
      subject: '',
      trimesterName: args.trimester.name,
      trimesterId: mongoose.Types.ObjectId(args.trimester._id.id),
      domain: args.userDomain,
      hasFilledSurvey: false
    });
  }
  // Tell the Rules view that rules has been accepted without validation. This is the best for User Experience.
  event.reply('rules-has-been-accepted', {});
})
