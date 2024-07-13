const global = require('./global');
const { appdata } = require("../models/data");
const helper = require('./helpers');

const {
    userModel,
    patientModel,
    requestModel,
    hematologyModel,
    urinalysisModel,
    fecalysisModel,
    chemistryModel,
    serologyModel,
    // Use this model to look for the corresponding test
    // Note: Can't query specific values of tests, use other
    // Models to query a specific category
    allTestModel
} = appdata;

function add(router) {
    //add request here
    router.get("/patient-request", function (req, resp) {
        patientModel.find().then(function (person) {
            let patientname = "";
            let patient = new Array();
            for (const instance of person) {
                let nameParts = instance.name.split(",");
                let lastName = nameParts[0].trim();
                if (lastName.includes(" ")) {
                    let lastNameParts = lastName.split(" ");
                    lastName = lastNameParts.join("");
                }
                let firstName = nameParts[1].trim().split(" ");
                firstName.pop();
                if (firstName.length > 1) {
                    firstName = firstName.join("");
                } else firstName = firstName.toString();
                patient.push({
                    patientID: instance.patientID,
                    name: instance.name,
                    firstname: firstName,
                    lastname: lastName,
                    sex: instance.sex,
                    birthday: instance.birthday,
                    age: instance.age,
                    phoneNo: instance.phoneNo,
                    email: instance.email,
                    address: instance.address,
                });
                patient.sort((a, b) => {
                    let lastNameComparison = a.lastname.localeCompare(b.lastname);
                    if (lastNameComparison === 0) {
                        return a.firstname.localeCompare(b.firstname);
                    }
                    return lastNameComparison;
                });
            }
            if (req.query.id) {
                for (let i = 0; i < patient.length; i++) {
                    if (patient[i].patientID == req.query.id) {
                        patientname = patient[i].name;
                        break;
                    }
                }
            }
            resp.render("patient_request", {
                layout: "index",
                title: "Laboratory Information System - Patient Request",
                patient: patient,
                user: global.loggedUser.name,
                fname: global.userFname[1],
                patientname: patientname
            });

        });
    });

    router.get("/add-patient-request", function (req, resp) {
        let patientID = req.query.patientID;
        let medtechID = global.loggedUser.medtechID;
        let category = req.query.category;
        let test = req.query.test;
        let baseNumber = 1000;
        let status = "Requested";
        let dateStart = new Date(new Date().getTime() + (8 * 60 * 60 * 1000));
        let dateEnd = null;
        let remarks = "";
        let payStatus = req.query.payStatus;


        // Based on the selected checkbox, add a test instance schema that
        // Corresponds to the actual request

        requestModel.find({}).then(async function (requests) {
            // check for the category
            let hemoglobinVal;
            let hematocritVal;
            let rbcCountVal;
            let wbcCountVal;
            let neutrophilVal;
            let lymphocyteVal;
            let monocyteVal;
            let eosinophilVal;
            let basophilVal;
            let withPlateletCountVal;
            let plateletCountVal;
            let esrVal;
            let bloodWithRhVal;
            let clottingTimeVal;
            let bleedingTimeVal;
            if (category == "Hematology") {
                if (test.includes('CBC')) {
                    hemoglobinVal = hematocritVal = rbcCountVal = wbcCountVal = neutrophilVal = lymphocyteVal = monocyteVal = eosinophilVal = basophilVal = -1;
                    // Make an instance of the schema and save
                    withPlateletCountVal = false;
                    if (test.includes('CBC with Platelet Count')) {
                        withPlateletCountVal = true;
                        plateletCountVal = -1;

                    }
                }

                if (test.includes('ESR')) {
                    esrVal = -1;
                }
                if (test.includes('Blood Type with Rh')) {
                    bloodWithRhVal = -1;
                }
                if (test.includes('Clotting Time')) {
                    clottingTimeVal = -1;
                }
                if (test.includes('Bleeding Time')) {
                    bleedingTimeVal = -1;
                }
                const hematologyInstance = new hematologyModel({
                    requestID: baseNumber + requests.length,
                    hemoglobin: hemoglobinVal,
                    hematocrit: hematocritVal,
                    rbcCount: rbcCountVal,
                    wbcCount: wbcCountVal,
                    neutrophil: neutrophilVal,
                    lymphocyte: lymphocyteVal,
                    monocyte: monocyteVal,
                    eosinophil: eosinophilVal,
                    basophil: basophilVal,
                    withPlateletCount: withPlateletCountVal,
                    plateletCount: plateletCountVal,
                    esr: esrVal,
                    bloodWithRh: bloodWithRhVal,
                    clottingTime: clottingTimeVal,
                    bleedingTime: bleedingTimeVal
                });

                hematologyInstance.save()

            } else if (category == "Clinical Microscopy") {
                if (test.includes('Urinalysis')) {

                    const urinalysisInstance = new urinalysisModel({
                        requestID: baseNumber + requests.length,
                        color: "",
                        transparency: "",
                        pH: -1,
                        specificGravity: -1,
                        sugar: "",
                        protein: "",
                        pus: -1,
                        rbc: -1,
                        bacteria: "",
                        epithelialCells: "",
                        mucusThread: ""
                    });
                    urinalysisInstance.save()

                }
                if (test.includes('Fecalysis')) {

                    const fecalysisInstance = new fecalysisModel({
                        requestID: baseNumber + requests.length,
                        color: "",
                        consistency: "",
                        wbc: -1,
                        rbc: -1,
                        bacteria: "",
                        ovaParasite: "",
                        fatGlobule: "",
                        bileCrystal: "",
                        vegetableFiber: "",
                        meatFiber: "",
                        pusCells: -1,
                        erythrocyte: -1,
                        yeastCell: -1
                    });
                    fecalysisInstance.save()

                }
                if (test.includes('FOBT')) {
                    console.log('coming soon');
                }

            } else if (category == "Chemistry") {
                let fbsVal;
                let rbsVal;
                let creatinineVal;
                let uricAcidVal;
                let cholesterolVal;
                let triglyceridesVal;
                let hdlVal;
                let ldlVal;
                let vldlVal;
                let bunVal;
                let sgptVal;
                let sgotVal;
                let hba1cVal;
                console.log(test);
                if (test.includes('FBS')) {
                    // Code for Creatinine
                    fbsVal = -1;
                }
                if (test.includes('rbs')) {
                    // Code for Creatinine
                    rbsVal = -1;
                }
                if (test.includes('Creatinine')) {
                    // Code for Creatinine
                    creatinineVal = -1;
                }
                if (test.includes('Uric Acid')) {
                    // Code for Uric Acid
                    uricAcidVal = -1;
                }
                if (test.includes('Cholesterol')) {
                    // Code for Cholesterol

                    cholesterolVal = -1;
                }
                if (test.includes('Triglycerides')) {
                    // Code for Triglycerides

                    triglyceridesVal = -1;
                }
                if (test.includes('HDL')) {
                    // Code for HDl
                    hdlVal = -1;
                }
                if (test.includes('LDL')) {
                    // Code for LDL
                    ldlVal = -1;
                }
                if (test.includes('VLDL')) {
                    // Code for VLDL
                    vldlVal = -1;
                }
                if (test.includes('BUN')) {
                    // Code for BUN
                    bunVal = -1;
                }
                if (test.includes('SGPT')) {
                    // Code for SGPT
                    sgptVal = -1;
                }
                if (test.includes('SGOT')) {
                    sgotVal = -1;
                }
                if (test.includes('HbA1c')) {
                    hba1cVal = -1;
                }
                const chemistryInstance = new chemistryModel({
                    requestID: baseNumber + requests.length,
                    fbs: fbsVal,
                    rbs: rbsVal,
                    creatinine: creatinineVal,
                    uricAcid: uricAcidVal,
                    cholesterol: cholesterolVal,
                    triglycerides: triglyceridesVal,
                    hdl: hdlVal,
                    ldl: ldlVal,
                    vldl: vldlVal,
                    bun: bunVal,
                    sgpt: sgptVal,
                    sgot: sgotVal,
                    hba1c: hba1cVal
                });
                chemistryInstance.save()

            } else if (category == "Serology") {
                let hbsAgVal;
                let rprVdrlVal;
                let pregnancyTestUrineVal;
                let pregnancyTestSerumVal;
                let dengueNs1Val;
                let dengueDuoVal;
                if (test.includes('HbsAg')) {
                    hbsAgVal = "";
                }
                if (test.includes('RPR/VDRL')) {
                    rprVdrlVal = "";

                }
                if (test.includes('Serum Pregnancy Test')) {
                    pregnancyTestSerumVal = "";
                }
                if (test.includes('Urine Pregnancy Test')) {
                    pregnancyTestUrineVal = "";

                }
                if (test.includes('Dengue NS1')) {
                    dengueNs1Val = "";
                }
                if (test.includes('Dengue Duo')) {
                    dengueDuoVal = "";
                }
                const serologyInstance = new serologyModel({
                    requestID: baseNumber + requests.length,
                    hbsAg: hbsAgVal,
                    rprVdrl: rprVdrlVal,
                    pregnancyTestSerum: pregnancyTestSerumVal,
                    pregnancyTestUrine: pregnancyTestUrineVal,
                    dengueNs1: dengueNs1Val,
                    dengueDuo: dengueDuoVal
                });
                serologyInstance.save()

            }
            const requestInstance = requestModel({
                requestID: baseNumber + requests.length,
                patientID: patientID,
                medtechID: medtechID,
                category: category,
                test: test,
                status: status,
                dateStart: dateStart,
                dateEnd: dateEnd,
                remarks: remarks,
                payStatus: payStatus
            });
            requestInstance.save().then(async function () {
                setTimeout(function() {
                    resp.redirect("/main/1");
                }, 500);
            });
        });
    });
}

module.exports.add = add;