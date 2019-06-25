const mongoose = require('mongoose');

const ruleSchema = mongoose.Schema({
  number: Number,
  text: String
});

module.exports = mongoose.model('Rule', ruleSchema);