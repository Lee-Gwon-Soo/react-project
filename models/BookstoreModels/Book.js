const mongoose = require('mongoose');
const {Schema} = mongoose;

const bookSchema = new Schema({
    title: String,
    author: String,
    publisher: String,
    img_path: String,
    ISBN:String,
    reviewCount: Number,
    reviewId : [{ type: Schema.Types.ObjectId, ref: 'BookReview' }],
    ins_dtime: Date,
    upd_dtime: Date
});

mongoose.model('Book', bookSchema);