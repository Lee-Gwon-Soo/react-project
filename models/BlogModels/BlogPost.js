const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const { Schema } = mongoose;

const blogPostSchema = new Schema({
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    _category: {type: Schema.Types.ObjectId, ref: 'BlogCategory'},
    _categoryTitle: String,
    title: String,
    content: String,
    basicImage: String,
    isMain: {type: Boolean, default: false},
    isUse: {type: Boolean, default: false},
    isPublish: {type: Boolean, default: false},
    isTopItem: {type: Boolean, default: false},
    publish_name: String,
    ins_dtime: Date,    
    upd_dtime: Date,
});

mongoose.model('BlogPost', blogPostSchema);
