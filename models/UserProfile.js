const mongoose = require('mongoose');
const { Schema } = mongoose;

const carrerSchema= new Schema({
    year: String,
    month: String,
    period: String,
    content : String,
})

const userProfile = new Schema({
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    profile_img: String,
    name: String,
    email: String,
    belongto: String,
    job: String,
    interest: String,
    _carrer: [carrerSchema],
    ins_dtime: Date
});

mongoose.model('UserProfile', userProfile);
