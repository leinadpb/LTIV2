const mongoose = require('mongoose');

const historyStudentSchema = mongoose.Schema({
  name: String,
  intecId: String,
  fullName: String,
  computer: String,
  room: String,
  createdAt: Date,
  subject: String,
  trimesterName: String,
  domain: String
});

module.exports = mongoose.model('HistoryStudent', historyStudentSchema);