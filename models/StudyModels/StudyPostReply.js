const mongoose = require('mongoose');
const {Schema} = mongoose;

const studyPostReplySchema = new Schema({
    _post: { type: Schema.Types.ObjectId, ref: 'StudyPost'},
    upper_reply_id: {type: Schema.Types.ObjectId, ref: 'StudyPostReply', default: null},
    img_path: String,
    author: String,
    content: String,
    likes: {type: Number, default: 0},
    ins_dtime: Date
});

mongoose.model('StudyPostReply', studyPostReplySchema);
