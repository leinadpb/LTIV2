const axiosInstance = require('../helpers/axios_instance.js');
const settings = require('../settings.js');

// Init axios - Set default configuration
const getQueries = axiosInstance.init().then((axios) => {
  /**
   * @title Database queries
   * @author Daniel Pena
   * @date: 11/08/2019
   */

  const EPS = settings.API.endpoints;

  // CONFIGS
  const getConfigs = () => {
    try {
      return axios.get(EPS.config.getConfigs)
    } catch (e) {
      log.error('getConfigs query error: ', e);
      return null;
    }
  }
  const updateConfig = (config) => {
    try {
      return axios.post(EPS.config.updateConfig, {
        config: config
      })
    } catch (e) {
      log.error('updateConfig query error: ', e);
      return null;
    }
  }
  const updatePreferences = async (preferences) => {
    try {
      return axios.post(EPS.config.updatePreferences, {
        preferences: preferences
      })
    } catch (e) {
      log.error('updatePreferences query error: ', e);
      return null;
    }
  }

  // RULES
  const getRules = () => {
    try {
      return axios.get(EPS.rule.getRules)
    } catch(e) {
      log.error('getRules query error: ', e);
      return null;
    }
  }
  const updateRule = (rule) => {
    try {
      return axios.post(EPS.rule.getRules, { rule: rule })
    } catch(e) {
      log.error('updateRule query error: ', e);
      return null;
    }
  }
  const deleteRule = (rule) => {
    try {
      return axios.delete(EPS.rule.deleteRule, { rule: rule })
    } catch(e) {
      log.error('deleteRule query error: ', e);
      return null;
    }
  }
  const addRule = (rule) => {
    try {
      return axios.post(EPS.rule.addRule, { rule: rule })
    } catch(e) {
      log.error('addRule query error: ', e);
      return null;
    }
  }
  const updateRuleByText = (rule) => {
    try {
      return axios.post(EPS.rule.updateRuleByText, { rule: rule })
    } catch(e) {
      log.error('updateRuleByText query error: ', e);
      return null;
    }
  }
  const updateRulesNumbers = (rules) => {
    try {
      return axios.post(EPS.rule.updateRulesNumbers, { rules: rules })
    } catch(e) {
      log.error('updateRulesNumbers query error: ', e);
      return null;
    }
  }

  // TRIMESTERS
  const getTrimesters = () => {
    try {
      return axios.get(EPS.trimester.getTrimesters)
    } catch(e) {
      log.error('getTrimesters query error: ', e);
      return null;
    }
  }
  const updateTrimester = (trimester) => {
    try {
      return axios.put(EPS.trimester.updateTrimester, { trimester: trimester })
    } catch(e) {
      log.error('updateTrimester query error: ', e);
      return null;
    }
  }
  const addTrimester = (trimester) => {
    try {
      return axios.post(EPS.trimester.addTrimester, { trimester: trimester })
    } catch(e) {
      log.error('addTrimester query error: ', e);
      return null;
    }
  }
  const getCurrentTrimester = () => {
    try {
      return axios.get(EPS.trimester.getCurrentTrimester)
    } catch(e) {
      log.error('getCurrentTrimester query error: ', e);
      return null;
    }
  }

  // History Students
  const getHistoryStudents = () => {
    try {
      return axios.get(EPS.student.getHistoryStudents)
    } catch(e) {
      log.error('getHistoryStudents query error: ', e);
      return null;
    }
  }
  const getHistoryStudentsFiltered = (filterObject) => {
    try {
      return axios.post(EPS.student.getHistoryStudentsFiltered, { 
        filterObj: filterObject
      })
    } catch(e) {
      log.error('getHistoryStudentsFiltered query error: ', e);
      return null;
    }
  }
  const getStudents = (intecId) => {
    try {
      return axios.get(`${EPS.student.getStudents}?intecId=${intecId}`)
    } catch(e) {
      log.error('getStudents query error: ', e);
      return null;
    }
  }
  const addStudent = (student) => {
    try {
      return axios.post(EPS.student.addStudent, {
        student: student
      })
    } catch(e) {
      log.error('addStudent query error: ', e);
      return null;
    }
  }
  const getStudentInCurrentTrimester = async (currentTrimester, userName) => {
    try {
      return axios.post(EPS.student.getStudentInCurrentTrimester, {
        currentTrimester: currentTrimester,
        userName: userName
      })
    } catch(e) {
      log.error('getStudentInCurrentTrimester query error: ', e);
      return null;
    }
  }

  // History Teachers
  const getTeachers = (intecId) => {
    try {
      return axios.get(`${EPS.teacher.getTeachers}/intecId=${intecId}`)
    } catch(e) {
      log.error('getTeachers query error: ', e);
      return null;
    }
  }
  const addTeacher = (teacher) => {
    try {
      return axios.post(EPS.teacher.addTeacher, {
        teacher: teacher
      })
    } catch(e) {
      log.error('addTeacher query error: ', e);
      return null;
    }
  }
  const getTeacherInCurrentTrimester = async (currentTrimester, userName) => {
    try {
      return axios.post(EPS.teacher.getTeacherInCurrentTrimester, {
        currentTrimester: currentTrimester,
        userName: userName
      })
    } catch(e) {
      log.error('getTeacherInCurrentTrimester query error: ', e);
      return null;
    }
  }

  // user common
  const updateSurveyStatus = (user, value) => {
    try {
      return axios.post(EPS.common.updateSurveyStatus, {
        user: user,
        value: value
      })
    } catch(e) {
      log.error('updateSurveyStatus query error: ', e);
      return null;
    }
  }
  const getUser = (intecId, domain) => {
    try {
      return axios.get(`${EPS.common.getUser}?intecId=${intecId}&domain=${domain}`)
    } catch(e) {
      log.error('getUser query error: ', e);
      return null;
    }
  }

  const getAppUser = (email) => {
    try {
      return axios.post(EPS.user.getAppUser, {
        email: email,
      })
    } catch(e) {
      log.error('getAppUser query error: ', e);
      return null;
    }
  }

  // BlackList
  const getBlackListUsers = () => {
    try {
      return axios.get(EPS.blacklist.getBlackListUsers)
    } catch(e) {
      log.error('getBlackListUsers query error: ', e);
      return null;
    }
  }
  const addBlackListUser = (user) => {
    try {
      return axios.post(EPS.blacklist.addBlackListUser, {
        user: user
      })
    } catch(e) {
      log.error('addBlackListUser query error: ', e);
      return null;
    }
  }
  const deleteBlackListUser = (user) => {
    try {
      return axios.delete(EPS.blacklist.deleteBlackListUser, {
        user: user
      })
    } catch(e) {
      log.error('deleteBlackListUser query error: ', e);
      return null;
    }
  }
  const updateBlackListUser = (user) => {
    try {
      return axios.put(EPS.blacklist.updateBlackListUser, {
        user: user
      })
    } catch(e) {
      log.error('updateBlackListUser query error: ', e);
      return null;
    }
  }


  const getSubjects = () => {
    try {
      return axios.get(EPS.subject.getSubjects)
    } catch(e) {
      log.error('getSubjects query error: ', e);
      return null;
    }
  }
  const addSubjects = (subjects) => {
    try {
      return axios.post(EPS.subject.addSubjects, {
        subjects: subjects
      })
    } catch(e) {
      log.error('addSubjects query error: ', e);
      return null;
    }
  }
  const removeAllSubjects = () => {
    try {
      return axios.delete(EPS.subject.removeAllSubjects, {
        subjects: subjects
      })
    } catch(e) {
      log.error('removeAllSubjects query error: ', e);
      return null;
    }
  }

  return {
    getConfigs,
    getRules,
    getTrimesters,
    getCurrentTrimester,
    getStudents,
    getTeachers,
    addStudent,
    addTeacher,
    getStudentInCurrentTrimester,
    getTeacherInCurrentTrimester,
    updateSurveyStatus,
    getBlackListUsers,
    addBlackListUser,
    deleteBlackListUser,
    updateBlackListUser,
    getUser,
    getHistoryStudents,
    getSubjects,
    getHistoryStudentsFiltered,
    updateRule,
    deleteRule,
    addRule,
    updateRulesNumbers,
    updateRuleByText,
    updateTrimester,
    addTrimester,
    updatePreferences,
    addSubjects,
    removeAllSubjects,
    getAppUser,
    updateConfig,
  }
})

module.exports = {
  getQueries: () => getQueries,
}