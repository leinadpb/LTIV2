const { app, BrowserWindow, ipcMain, electron } = require('electron');
const killBrowsers = require('./helpers/kill_browsers');
const test = require('./helpers/test_helper');
const settings = require('./settings');
const mongoose = require('mongoose');
const queriesFns = require('./db/queries');
const os = require('os');
const path = require('path');

require('electron-reload')(__dirname);
const unhandled = require('electron-unhandled');
unhandled();

if (handleSquirrelEvent()) {
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

require('dotenv').config();

let window;
let jobs;
let width = 800;
let height = 600;
let canQuitApp = false;

let queries = undefined;

const executeJobs = () => {
  killBrowsers.execute();
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
  const user = (await queries.getUser(userName, userDomain)).data.data;
  console.log('User obtained on show survey before: ', user);
  if (userDomain.toLowerCase() === "intec") {
    if (APP_PREFERENCES.activateStudentSurvey) {
      if (!user.hasFilledSurvey) {
        showSurvey(APP_PREFERENCES.studentUrl, user);
      } else {
        canQuitApp = true;
        app.quit();
      }
    } else {
      app.quit();
    }
  } else {
    if(APP_PREFERENCES.activateTeacherSurvey) {
      if (!user.hasFilledSurvey) {
        showSurvey(APP_PREFERENCES.teacherUrl, user);
      } else {
        canQuitApp = true;
        app.quit();
      }
    } else {
      app.quit();
    }
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
  const RULES = (await queries.getRules()).data.data;
  const SUBJECTS = (await queries.getSubjects()).data.data;
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

  queriesFns.getQueries().then(async (_queries) => {
    queries = _queries;
    // get user info
    let userDomain = process.env.USERDOMAIN || "intec";
    let userName = process.env.USERNAME || os.userInfo().username;

    try {

      // Get Blacklist users
      const blackListedUsers = (await _queries.getBlackListUsers()).data.data;
      const isUserBlackListed = blackListedUsers.find(u => u.intecId.toLowerCase() === userName.toLowerCase());

      if (isUserBlackListed) {
        // Stop execution of the program.
        console.log('You are blacklisted, so the program will close.');
        app.quit();
        return;
      }

      // get configs
      const configs = (await _queries.getConfigs()).data.data;

      const currentTrimester = (await _queries.getCurrentTrimester()).data.data;

      const APP_PREFERENCES = {
        fullscreen: !!configs.find(cfg => cfg.key === settings.CONFIGS.isFullscreen) ? configs.find(cfg => cfg.key === settings.CONFIGS.isFullscreen).value : '',
        showSurvey: !!configs.find(cfg => cfg.key === settings.CONFIGS.showSurvey) ? configs.find(cfg => cfg.key === settings.CONFIGS.showSurvey).value : '',
        studentUrl: !!configs.find(cfg => cfg.key === settings.CONFIGS.studentUrl) ? configs.find(cfg => cfg.key === settings.CONFIGS.studentUrl).value : '',
        teacherUrl:  !!configs.find(cfg => cfg.key === settings.CONFIGS.teacherUrl) ? configs.find(cfg => cfg.key === settings.CONFIGS.teacherUrl).value : '',
        reminderText: !!configs.find(cfg => cfg.key === settings.CONFIGS.reminderText) ? configs.find(cfg => cfg.key === settings.CONFIGS.reminderText).value : '',
        showRulesReminder: !!configs.find(cfg => cfg.key === settings.CONFIGS.showRulesReminder) ? configs.find(cfg => cfg.key === settings.CONFIGS.showRulesReminder).value : '',
        activateStudentSurvey: !!configs.find(cfg => cfg.key === settings.CONFIGS.activateStudentSurvey) ? (configs.find(cfg => cfg.key === settings.CONFIGS.activateStudentSurvey).value.toLowerCase() === "true") ? true : false : true,
        activateTeacherSurvey: !!configs.find(cfg => cfg.key === settings.CONFIGS.activateTeacherSurvey) ? (configs.find(cfg => cfg.key === settings.CONFIGS.activateTeacherSurvey).value.toLowerCase() === "true") ? true : false : true,
      }

      console.log(APP_PREFERENCES);


      const USERS = (userDomain.toLowerCase() === "intec") ? (await _queries.getStudentInCurrentTrimester(currentTrimester[0], userName)).data.data : (await _queries.getTeacherInCurrentTrimester(currentTrimester[0], userName)).data.data;
      const USER = USERS[0];

      console.log("CURRENT STUDENT", USER);
      if (!USER) {
        showRules(userName, userDomain, currentTrimester[0], APP_PREFERENCES);
      } else {
        console.log(USER);
        if (APP_PREFERENCES.showRulesReminder.toLowerCase() === "true") {
          showReminder(USER, APP_PREFERENCES);
        } else {
          app.quit();
        }
      }
    } catch (ex) {
      console.log('Something bad ocurred. This application will shutdown. Please, contact your Main developer to get around this issue.');
    }

    // TODO: Move this to a child_process ----->
    // Execute this code to Close any browser. So user first completes this process and then,
    //  can use the computer.
    // jobs = setInterval(() => {
    //   executeJobs();
    // }, 3000);
  })  
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
});
 