const mongoose = require('mongoose');
const {Schema} = mongoose;

const maillogSchema = new Schema({
    from_email: String,
    to_email: String,
    content: String,
    is_sent: {type: Boolean, default: false},
    sent_dtime: Date
});

mongoose.model('maillogs', maillogSchema);