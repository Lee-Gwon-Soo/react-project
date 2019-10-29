const mongoose = require('mongoose');
const {Schema} = mongoose;

const studyPostSchema = new Schema({
    _study: { type: Schema.Types.ObjectId, ref: 'Study'},
    title: String,
    content: String,
    author: String,
    imageLink: String,
    videoLink: String,
    uploadList: [String],
    replyCount: {type: Number, default: 0},
    ins_dtime: Date
});

mongoose.model('StudyPost', studyPostSchema);
