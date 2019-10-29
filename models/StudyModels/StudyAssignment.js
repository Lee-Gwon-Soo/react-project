const mongoose = require('mongoose');
const {Schema} = mongoose;

const QuestionSchema = new Schema({
    type: String,
    question: String,
    options: [String],
    answer: String,
    imageLink: String,
    videoLink: String,
    audioLink: String,
});

const StatusSchema = new Schema({
    index: String,
    answer: String,
    result: { type: Boolean, default: false}
});

const assignmentWork = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User'},
    isDone: { type: Boolean, default: false},
    isProcessing: { type: Boolean, default: false},
    processStatus: [StatusSchema],
    complete_dtime: Date 
})

const StudyAssignment = new Schema({
    _study: { type: Schema.Types.ObjectId, ref: 'Study'},
    questionList: [QuestionSchema],
    title: String,
    publisher: String,
    publisher_img: String,
    questionCount: {type: Number, default: 0},
    status: [assignmentWork],
    ins_dtime: Date
});

mongoose.model('StudyAssignment', StudyAssignment);
