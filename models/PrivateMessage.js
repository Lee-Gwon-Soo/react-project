const mongoose = require('mongoose');
const { Schema } = mongoose;

const PrivateMessageSchema = new Schema({
    upper_message_id: {type: Schema.Types.ObjectId, ref: 'PrivateMessage', default: null},
    original_message_id: {type: Schema.Types.ObjectId, ref: 'PrivateMessage', default: null},
    sender_id: {type: Schema.Types.ObjectId, ref: 'User'},
    receiver_id: {type: Schema.Types.ObjectId, ref: 'User'},
    receiverName: String,
    receiverEmail: String,
    senderName: String,
    isLast: {type: Boolean, default: true},
    isOwn: Boolean,
    title: String,
    content: String,
    isRead: {type: Boolean, default: false},
    ins_dtime: Date
});

mongoose.model('PrivateMessage', PrivateMessageSchema);
