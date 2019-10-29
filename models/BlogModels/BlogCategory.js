const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogCategorySchema = new Schema({
    _user: String,
    title: String,
    description: String,
    detail_descrption: String,
    imagePath: String,
    isOpen: {type: Boolean, default: false},
    ins_dtime: Date,    
    upd_dtime: Date,
});

mongoose.model('BlogCategory', blogCategorySchema);
