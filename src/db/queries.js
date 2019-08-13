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
    return axios.get(EPS.config.getConfigs)
  }
  const updateConfig = (config) => {
    return axios.post(EPS.config.updateConfig, {
      config: config
    })
  }
  const updatePreferences = async (preferences) => {
    return axios.post(EPS.config.updatePreferences, {
      preferences: preferences
    })
  }

  // RULES
  const getRules = () => {
    return axios.get(EPS.rule.getRules)
  }
  const updateRule = (rule) => {
    return axios.post(EPS.rule.getRules, { rule: rule })
  }
  const deleteRule = (rule) => {
    return axios.delete(EPS.rule.deleteRule, { rule: rule })
  }
  const addRule = (rule) => {
    return axios.post(EPS.rule.addRule, { rule: rule })
  }
  const updateRuleByText = (rule) => {
    return axios.post(EPS.rule.updateRuleByText, { rule: rule })
  }
  const updateRulesNumbers = (rules) => {
    return axios.post(EPS.rule.updateRulesNumbers, { rules: rules })
  }

  // TRIMESTERS
  const getTrimesters = () => {
    return axios.get(EPS.trimester.getTrimesters)
  }
  const updateTrimester = (trimester) => {
    return axios.put(EPS.trimester.updateTrimester, { trimester: trimester })
  }
  const addTrimester = (trimester) => {
    return axios.post(EPS.trimester.addTrimester, { trimester: trimester })
  }
  const getCurrentTrimester = () => {
    return axios.get(EPS.trimester.getCurrentTrimester)
  }

  // History Students
  const getHistoryStudents = () => {
    return axios.get(EPS.student.getHistoryStudents)
  }
  const getHistoryStudentsFiltered = (filterObject) => {
    return axios.post(EPS.student.getHistoryStudentsFiltered, { 
      filterObj: filterObject
    })
  }
  const getStudents = (intecId) => {
    return axios.get(`${EPS.student.getStudents}?intecId=${intecId}`)
  }
  const addStudent = (student) => {
    return axios.post(EPS.student.addStudent, {
      student: student
    })
  }
  const getStudentInCurrentTrimester = async (currentTrimester, userName) => {
    return axios.post(EPS.student.getStudentInCurrentTrimester, {
      currentTrimester: currentTrimester,
      userName: userName
    })
  }

  // History Teachers
  const getTeachers = (intecId) => {
    return axios.get(`${EPS.teacher.getTeachers}/intecId=${intecId}`)
  }
  const addTeacher = (teacher) => {
    return axios.post(EPS.teacher.addTeacher, {
      teacher: teacher
    })
  }
  const getTeacherInCurrentTrimester = async (currentTrimester, userName) => {
    return axios.post(EPS.teacher.getTeacherInCurrentTrimester, {
      currentTrimester: currentTrimester,
      userName: userName
    })
  }

  // user common
  const updateSurveyStatus = (user, value) => {
    return axios.post(EPS.common.updateSurveyStatus, {
      user: user,
      value: value
    })
  }
  const getUser = (intecId, domain) => {
    return axios.get(`${EPS.common.getUser}?intecId=${intecId}&domain=${domain}`)
  }

  const getAppUser = (email) => {
    return axios.post(EPS.user.getAppUser, {
      email: email,
    })
  }

  // BlackList
  const getBlackListUsers = () => {
    return axios.get(EPS.blacklist.getBlackListUsers)
  }
  const addBlackListUser = (user) => {
    return axios.post(EPS.blacklist.addBlackListUser, {
      user: user
    })
  }
  const deleteBlackListUser = (user) => {
    return axios.delete(EPS.blacklist.deleteBlackListUser, {
      user: user
    })
  }
  const updateBlackListUser = (user) => {
    return axios.put(EPS.blacklist.updateBlackListUser, {
      user: user
    })
  }


  const getSubjects = () => {
    return axios.get(EPS.subject.getSubjects)
  }
  const addSubjects = (subjects) => {
    return axios.post(EPS.subject.addSubjects, {
      subjects: subjects
    })
  }
  const removeAllSubjects = () => {
    return axios.delete(EPS.subject.removeAllSubjects, {
      subjects: subjects
    })
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