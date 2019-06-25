const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({ key: 'string', value: 'string' });

module.exports = mongoose.model("Config", configSchema);