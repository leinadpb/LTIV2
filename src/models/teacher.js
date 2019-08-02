const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
  name: String,
  intecId: String
});

module.exports = mongoose.model('Teacher', teacherSchema);