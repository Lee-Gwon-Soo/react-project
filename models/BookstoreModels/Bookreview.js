const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookReviewSchema = new Schema({
    _user : { type: Schema.Types.ObjectId, ref: 'User'},
    _bookstoreId : { type: Schema.Types.ObjectId, ref: 'Bookstore'},
    bookTitle: String,
    author: String,
    publisher: String,
    img_path: String,
    ISBN:String,
    title : String,
    content: String,
    is_shared: {type: Boolean, default: true},
    claps: {type: Number, default: 0},
    ins_dtime: Date,
    upd_dtime: Date,
});

mongoose.model('BookReview', BookReviewSchema);