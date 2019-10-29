const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentCheckSchema= new Schema({
    assignmentId: {type: Schema.Types.ObjectId, ref: 'StudyAssignment'},
    isChecked: {type: Boolean, default: false}
})

const userSchema = new Schema({
    googleId: String,
    email: String,
    password: String,
    status_cd: {type: String, default: 'A'},
    _studies: [{type: Schema.Types.ObjectId, ref: 'Study'}],
    _assignments: [assignmentCheckSchema],
    name: String,
    name_en: String,
    tel_no: String,
    belongto: String,
    position: String,
    job: String,
    address: String,
    img_path: String,
    isEmoticon: {type: Boolean, default: false},
    intro: String,
    isAgreed: {type: Boolean, default: false},
    regTime: Date
});

mongoose.model('User', userSchema);
