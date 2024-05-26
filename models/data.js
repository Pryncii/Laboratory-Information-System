
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/LISdb');

const userSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String },
    email: { type: String },
    phoneNo: { type: String },
    sex: { type: String },
    password: { type: String },
    prcno: { type: String },
    isMedtech: { type: Boolean },
},{ versionKey: false });

const userModel = mongoose.model('users', userSchema);

const patientSchema = new mongoose.Schema({
name: { type: String },
sex: { type: String },
birthday: {type: Date},
age: {type: Number},
phoneNo: {type: String},
email: {type: String},
address: {type: String},
},{ versionKey: false });

const patientModel = mongoose.model('patients', patientSchema);

let appdata = {
    'patientModel'   : patientModel,
    // add other models here
    'userModel'      : userModel,
};

module.exports.appdata = appdata;
module.exports.mongoose = mongoose;

