const mongoose = require('mongoose');
const {Schema} = mongoose;

const studySchema = new Schema({
    _user: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    creater_id: { type: Schema.Types.ObjectId, ref: 'User'},
    name: String,
    field: String,
    email: String,
    place: String,
    memCount: {type: Number, default: 2},
    currentMemberCount: {type: Number, default: 1},
    img_path: String,
    intro: String,
    ins_dtime: Date
});

mongoose.model('Study', studySchema);
