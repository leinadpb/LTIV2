const mongoose = require('mongoose');

const historyStudentSchema = mongoose.Schema({
  name: String,
  intecId: String,
  fullName: String,
  computer: String,
  room: String,
  createdAt: Date,
  subject: String,
  teacher: String,
  section: String,
  trimesterName: String,
  trimesterId: mongoose.Types.ObjectId,
  domain: String,
  hasFilledSurvey: Boolean
});

module.exports = mongoose.model('HistoryStudent', historyStudentSchema);