const mongoose = require('mongoose');
const { Schema } = mongoose;

const DailyCheckSchema = new Schema({
  date: String,
  checked: { type: Boolean, default: false }
});

module.exports = DailyCheckSchema;
