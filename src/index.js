const { app, BrowserWindow, ipcMain, electron } = require('electron');
const killBrowsers = require('./helpers/kill_browsers');
const test = require('./helpers/test_helper');
const settings = require('./settings');
const mongoose = require('mongoose');
const queries = require('./db/queries');
const os = require('os');
const path = require('path');

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

const showSurvey = (url) => {
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
  window.loadFile(path.join(__dirname, 'pages', `${settings.PAGES.surveyPage}.html`));
  // window.webContents.openDevTools();
  window.on('close', () => {
    console.log('You have closed survey window');
    app.quit();
  })
}

const showSurveyOrClose = (APP_PREFERENCES, userDomain) => {
  // TODO: Move this code to execute AFTER ONE OF
  // THE PREVIOUS WINDOWAS ARE CLOSED....
  if (APP_PREFERENCES.showSurvey) {
    if (userDomain === "intec") {
      showSurvey(APP_PREFERENCES.studentUrl);
    } else {
      showSurvey(APP_PREFERENCES.teacherUrl);
    }
  } else {
    canQuitApp = true;
    app.quit();
  }
}

const showReminder = (userDomain, APP_PREFERENCES) => {
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
  window.loadFile(path.join(__dirname, 'pages', `${settings.PAGES.reminderPage}.html`));
  // window.webContents.openDevTools();
  window.on('close', () => {
    console.log('You have closed reminder window');
    // showSurveyOrClose(userDomain, APP_PREFERENCES);
  })
}

const showRules = async (username, trimester, userDomain, APP_PREFERENCES) => {
  const RULES = await queries.getRules();
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
  window.loadFile(path.join(__dirname, 'pages', `${settings.PAGES.rulesPage}.html`));
  // window.webContents.openDevTools();
  window.on('close', () => {
    console.log('You have closed rules window');
    showSurveyOrClose(userDomain, APP_PREFERENCES);
  });
  setTimeout(() => {
    window.webContents.send('rules-window-data', {
      rules: RULES,
      user: {
        username: username,
        domain: userDomain
      },
      trimester: trimester
    });
  }, 500);
}

app.on('ready', async () => {

  showReminder(null);
  

  // // connect to DB
  // require('./helpers/connect_db')
  // // Seed data if needed
  // require('./db/seed');
  // // get configs
  // const configs = await queries.getConfigs();
  // // get trimestres
  // const trimesters = await queries.getTrimesters();
  // // get user info
  // let userDomain = process.env.USERDOMAIN || "intec";
  // let userName = process.env.USERNAME || os.userInfo().username || "1066359"; // TEST

  // const currentTrimester = await queries.getCurrentTrimester();

  // const APP_PREFERENCES = {
  //   fullscreen: configs.find(cfg => cfg.key === settings.CONFIGS.isFullscreen).value,
  //   showSurvey: configs.find(cfg => cfg.key === settings.CONFIGS.showSurvey).value,
  //   studentUrl: configs.find(cfg => cfg.key === settings.CONFIGS.studentUrl).value,
  //   teacherUrl: configs.find(cfg => cfg.key === settings.CONFIGS.teacherUrl).value,
  // }

  // const STUDENTS = await queries.getStudentInCurrentTrimester(currentTrimester[0]);
  // const CURRENT_STUDENT = STUDENTS[0];

  // if (!CURRENT_STUDENT) {
  //   console.log(CURRENT_STUDENT);
  //   showRules(userName, currentTrimester[0], userDomain, APP_PREFERENCES);
  // } else {
  //   showReminder(APP_PREFERENCES);
  // }
  
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
  await queries.addStudent({
    name: args.userName,
    intecId: args.userName,
    fullName: args.userName,
    computer: os.hostname(),
    room: '',
    createdAt: Date.now(),
    subject: '',
    trimesterName: args.trimester.name,
    domain: args.userDomain
  });
})