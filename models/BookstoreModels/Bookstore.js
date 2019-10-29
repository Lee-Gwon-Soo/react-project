const mongoose = require('mongoose');
const {Schema} = mongoose;

const bookstoreSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User'},
    bookcount: { type: Number, default : 0 },
    nickname: String,
    bookstoreCode: String,
    plan: String,
    limit: Number,
    ins_dtime: Date,
    upd_dtime: Date,
});

mongoose.model('Bookstore', bookstoreSchema);