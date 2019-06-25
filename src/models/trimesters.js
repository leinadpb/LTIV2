const mongoose = require('mongoose');

const trimestreSchema = new mongoose.Schema({ 
  start: Date,
  ends: Date,
  name: String,
  lastModified: Date,
  customId: String
});

module.exports = mongoose.model("Trimester", trimestreSchema);