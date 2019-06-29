const ConfigModel = require('../models/config');
const RuleModel = require('../models/rule');
const TrimesterModel = require('../models/trimesters');
const HistoryStudentModel = require('../models/historyStudent');
const HistoryTeacherModel = require('../models/historyTecher');
const BlackListModel = require('../models/blackList');

// CONFIGS
const getConfigs = () => {
  return ConfigModel.find({}, (err, docs) => {
    if (!!err) {
      console.log('Error retreiving configurations: ', err);
      return null;
    }
    return docs;
  }).lean();
}

// RULES
const getRules = () => {
  return RuleModel.find({}, (err, docs) => {
    if (!!err) {
      console.log('Error retreiving rules: ', err);
      return null;
    }
    return docs;
  }).lean();
}

// TRIMESTERS
const getTrimesters = () => {
  return TrimesterModel.find({}, (err, docs) => {
    if (!!err) {
      console.log('Error retreiving Trimesters: ', err);
      return null;
    }
    return docs;
  }).lean();
}
const getCurrentTrimester = () => {
  const todayDate = Date.now();
  return TrimesterModel.find({
    start: {
      '$lte': todayDate
    },
    ends: {
      '$gte': todayDate
    }
  }, (err, docs) => {
    if (err) {
      console.error(err);
      return;
    }
  }).lean();
}

// History Students
const getStudents = (intecId) => {
  return HistoryStudentModel.find({}, (err, docs) => {
    if (!!err) {
      console.log('Error retreiving student: ', err);
      return null;
    }
    return docs;
  }).lean();
}
const addStudent = (student) => {
  return HistoryStudentModel.create(student, (err, doc) => {
    if (!!err) {
      console.log('Error creating student: ', err);
      return null;
    }
    return doc;
  });
}
const getStudentInCurrentTrimester = async (currentTrimester, userName) => {
  // TODO: Get student with createdAt date betwwen current trimester
  const result = await HistoryStudentModel.find({
    createdAt: {
      '$gte': new Date(currentTrimester.start),
      '$lte': new Date(currentTrimester.ends)
    },
    intecId: userName
  }, (err, docs) => {
    if (!!err) {
      console.log('Error retreiving student: ', err);
      return null;
    }
    return docs;
  }).lean();
  return result;
}

// History Teachers
const getTeachers = (intecId) => {
  return HistoryTeacherModel.find({}, (err, docs) => {
    if (!!err) {
      console.log('Error retreiving teacher: ', err);
      return null;
    }
    return docs;
  }).lean().exec();
}
const addTeacher = (teacher) => {
  return HistoryTeacherModel.create(teacher, (err, doc) => {
    if (!!err) {
      console.log('Error creating teacher: ', err);
      return null;
    }
    return doc;
  }).lean().exec();
}
const getTeacherInCurrentTrimester = async (currentTrimester, userName) => {
  // TODO: Get student with createdAt date betwwen current trimester
  const result = await HistoryTeacherModel.find({
    createdAt: {
      '$gte': new Date(currentTrimester.start),
      '$lte': new Date(currentTrimester.ends)
    },
    intecId: userName
  }, (err, docs) => {
    if (!!err) {
      console.log('Error retreiving student: ', err);
      return null;
    }
    return docs;
  }).lean();
  return result;
}

// user common
const updateSurveyStatus = (domain, intecId, value) => {
  if (domain.toLowerCase() === "intec") {
    return HistoryStudentModel.updateOne({intecId: intecId}, { hasFilledSurvey: value }, (err, doc) => {
      if (!!err) {
        console.log('Error creating teacher: ', err);
        return null;
      }
      return doc;
    }).lean().exec();

  } else {
    return HistoryTeacherModel.updateOne({intecId: intecId}, { hasFilledSurvey: value }, (err, doc) => {
      if (!!err) {
        console.log('Error creating teacher: ', err);
        return null;
      }
      return doc;
    }).lean().exec();
  }
}
const getUser = (intecId, domain) => {
  if (domain.toLowerCase() === "intec") {
    return HistoryStudentModel.findOne({intecId: intecId}, (err, doc) => {
      if (!!err) {
        console.log('Error getting user with id: ', intecId, ' Error: ', err);
        return;
      }
      return doc;
    }).lean()
  } else {
    return HistoryTeacherModel.findOne({intecId: intecId}, (err, doc) => {
      if (!!err) {
        console.log('Error getting user with id: ', intecId, ' Error: ', err);
        return;
      }
      return doc;
    }).lean()
  }
}

// BlackList
const getBlackListUsers = () => {
  return BlackListModel.find({}, (err, docs) => {
    if (!!err) {
      console.log('Error retreiving Trimesters: ', err);
      return null;
    }
    return docs;
  }).lean();
}
const addBlackListUser = (intecId, domain) => {
  return BlackListModel.create({intecId: intecId, domain: domain}, (err) => {
    if (!!err) {
      console.log('Error retreiving Trimesters: ', err);
      return null;
    }
  });
}
const deleteBlackListUser = (intecId) => {
  return BlackListModel.findOneAndDelete({intecId: intecId}, (err) => {
    if (!!err) {
      console.log('Error retreiving Trimesters: ', err);
      return null;
    }
  });
}

module.exports = {
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
  getUser,
}