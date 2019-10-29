const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReplySchema = new Schema({
    _postId: {type: Schema.Types.ObjectId, ref: 'BlogPost'},
    content: String,
    author: String,
    is_deleted: {type:Boolean, default:false},
    del_dtime: Date,
    likes: {type: Number, default: 0},
    hates: {type: Number, default: 0},
    ins_dtime: Date,
});

mongoose.model('BlogReply', ReplySchema);