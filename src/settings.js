require('dotenv').config();

let envs = process.env;
try {
  envs = require('../../environments.js');
} catch (ex) {
  console.log('Please, create environments.js file (with all needed environments variables) in the root project before deploying to production: ', ex);
}

const PAGES = {
  startPage: 'start',
  rulesPage: 'rules',
  reminderPage: 'rulesReminder',
  surveyPage: 'survey'
}

const CONFIGS = {
  studentUrl: 'STUDENT_URL',
  teacherUrl: 'TEACHER_URL',
  activateStudentSurvey: 'ACTIVATE_STUDENT_SURVEY',
  activateTeacherSurvey: 'ACTIVATE_TEACHER_SURVEY',
  showSurvey: 'SHOW_SURVEY',
  showRulesReminder: 'SHOW_RULE_REMINDER',
  isFullscreen: "FULL_SCREEN",
  reminderText: "REMINDER_TEXT",
  allowSelectCustomData: 'ALLOW_SELECT_CUSTOM_DATA',
}

const SERVER_HOST = envs.SERVER_HOST;
const SERVER_PORT = envs.SERVER_PORT;
const API = {
  baseURL: `http://${SERVER_HOST}:${SERVER_PORT}/api/v1`,
  endpoints: {
    config: {
      getConfigs: '/configs', // GET
      updateConfig: '/configs', // POST
      updatePreferences: '/configs/preferences', // POST
    },
    blacklist: {
      getBlackListUsers: '/blacklist', // GET
      addBlackListUser: '/blacklist', // POST
      updateBlackListUser: '/blacklist', // PUT
      deleteBlackListUser: '/blacklist', // DELETE
    },
    common: {
      updateSurveyStatus: '/common/survey-status', // POST
      getUser: '/common/user', // GET
    },
    rule: {
      getRules: '/rules', // GET
      updateRule: '/rules', // POST
      deleteRule: '/rules', // DELETE
      addRule: '/rules', // POST
      updateRuleByText: '/rules/update-by-text', // POST
      updateRulesNumbers: '/rules/update-numbers', //POST
    },
    student: {
      getStudents: '/students/single', //GET
      getHistoryStudentsFiltered: '/students/filtered', // POST
      getHistoryStudents: '/students', // GET
      addStudent: '/students', // POST
      getStudentInCurrentTrimester: '/students/current-trimester', // POST
    },
    subject: {
      getSubjects: '/subjects', // GET
      addSubjects: '/subjects', // POST
      removeAllSubjects: '/subjects', // DELETE
    },
    teacher: {
      getTeachers: '/teachers/single', // GET
      addTeacher: '/teachers', // POST
      getTeacherInCurrentTrimester: '/teachers/current-trimester', // POST
    },
    trimester: {
      getTrimesters: '/trimesters', // GET
      getCurrentTrimester: '/trimesters/current', // GET
      addTrimester: '/trimesters', // POST
      updateTrimester: '/trimesters', // PUT
    },
    user: {
      getUser: '/users', // GET
      getAppUser: '/users/app-user', // GET
    }
  }
}

module.exports = {
  PAGES,
  CONFIGS,
  API
}