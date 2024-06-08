
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/LISdb');

const userSchema = new mongoose.Schema({
    medtechID: {type: Number},
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
    patientID: {type: Number},
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
    requestID: {type: Number},
    patientID: {type: Number},
    medtechID:{type: Number},
    category: {type: String},
    status: {type: String},
    dateStart: {type: Date},
    dateEnd: {type: Date},
    remarks: {type: String}
    },{ versionKey: false });
    
const requestModel = mongoose.model('requests', requestSchema);


const hematologySchema = new mongoose.Schema({
    requestId: { type: Number },
    hemoglobin: { type: Number },
    hematocrit: { type: Number },
    rbcCount: { type: Number },
    wbcCount: { type: Number },
    neutrophil: { type: Number },
    lymphocyte: { type: Number },
    monocyte: { type: Number },
    eosinophil: { type: Number },
    basophil: { type: Number },
    withPlateletCount: { type: Boolean },
    plateletCount: { 
      type: Number,
      validate: {
        validator: function() {
          return this.withPlateletCount ? this.plateletCount != null : true;
        },
        message: 'plateletCount is required if withPlateletCount is true'
      }
    }
  }, { versionKey: false });

const hematologyModel = mongoose.model('tests', hematologySchema);

const urinalysisSchema = new mongoose.Schema({
    color: { type: String },
    transparency: { type: String },
    pH: { type: Number },
    specificGravity: { type: Number },
    sugar: { type: String },
    protein: { type: String },
    pus: { type: Number },
    rbc: { type: Number },
    bacteria: { type: String },
    epithelialCells: { type: String },
    mucusThread: { type: String }
  }, { versionKey: false });

const fecalysisSchema = new mongoose.Schema({
    color: { type: String },
    consistency: { type: String },
    wbc: { type: Number },
    rbc: { type: Number },
    bacteria: { type: String },
    ovaParasite: { type: String },
    fatGlobule: { type: String },
    bileCrystal: { type: String },
    vegetableFiber: { type: String },
    meatFiber: { type: String },
    pusCells: { type: Number },
    erythrocyte: { type: Number },
    yeastCell: { type: Number }
  }, { versionKey: false });

const clinicalMicroscopySchema = new mongoose.Schema({
    requestID : {type: Number},
    hasUrinalysis: {type: Boolean},
    hasFecalysis: {type: Boolean},
    fecalysis: [fecalysisSchema],
    urinalysis: [urinalysisSchema]
}, { versionKey: false });

const clinicalMicroscopyModel = mongoose.model('tests', clinicalMicroscopySchema);

const chemistrySchema = new mongoose.Schema({
    requestId: { type: Number },
    fbs: { type: Number },
    creatinine: { type: Number },
    uricAcid: { type: Number },
    cholesterol: { type: Number },
    triglycerides: { type: Number },
    hdl: { type: Number },
    ldl: { type: Number },
    vldl: { type: Number },
    bun: { type: Number },
    sgpt: { type: Number },
    sgot: { type: Number },
    hba1c: { type: Number }
  }, { versionKey: false });

const chemistryModel = mongoose.model('tests', chemistrySchema);

const serologySchema = new mongoose.Schema({
    requestId: { type: Number },
    hbsAg: { type: String },
    rprVdrl: { type: String },
    pregnancyTest: { type: String },
    dengueNs1: { type: String },
    dengueDuo: { type: String }
  }, { versionKey: false });

const serologyModel = mongoose.model('tests', serologySchema);


let appdata = {
    'patientModel'   : patientModel,
    // add other models here
    'userModel'      : userModel,
    'requestModel'   : requestModel,
    'hematologyModel' : hematologyModel,
    'clinicalMicroscopyModel' : clinicalMicroscopyModel,
    'chemistryModel' : chemistryModel,
    'serologyModel' : serologyModel
};

module.exports.appdata = appdata;
module.exports.mongoose = mongoose;
