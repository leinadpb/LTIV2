const mongoose = require('mongoose');

const BlackListSchema = new mongoose.Schema({
  intecId: String,
  domain: String,
  fullName: String,
});

module.exports = mongoose.model("BlackList", BlackListSchema);