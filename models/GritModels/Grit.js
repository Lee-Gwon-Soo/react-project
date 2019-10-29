const mongoose = require('mongoose');
const { Schema } = mongoose;
const DailyCheckSchema = require('./DailyCheck');

const gritSchema = new Schema({
    _user: String,
    title: String,
    type: String,
    startDate: String,
    dueDate: String,
    checkList: [DailyCheckSchema],
    completed: {type: Number, default: 0},
    allChecked: {type: Boolean, default: false},
    ins_dtime: Date,    
    upd_dtime: Date,
});

mongoose.model('grits', gritSchema);
