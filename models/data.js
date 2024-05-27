
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
    remarks: {type: String}
    },{ versionKey: false });

const patientModel = mongoose.model('patients', patientSchema);

const requestSchema = new mongoose.Schema({
    patient: { type: String },
    medtech: { type: String },
    category: {type: String},
    status: {type: String},
    dateStart: {type: Date},
    dateEnd: {type: Date},
    remarks: {type: String}
    },{ versionKey: false });
    
const requestModel = mongoose.model('requests', requestSchema);

let appdata = {
    'patientModel'   : patientModel,
    // add other models here
    'userModel'      : userModel,
    'requestModel'      : requestModel,
};

module.exports.appdata = appdata;
module.exports.mongoose = mongoose;

