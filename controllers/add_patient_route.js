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
    router.get("/add-patient", function (req, resp) {
        resp.render("add_patient", {
            layout: "index",
            title: "Add Patient - Laboratory Information System",
            user: global.loggedUser.name,
            fname: global.userFname[1],
        });
    });

    router.post("/add-patient-db", function (req, resp) {
        let baseNo = 1000;
        patientModel
            .find({})
            .then(function (patients) {
                //add to the database patient details
                let lname = req.body.lname.trim()[0].toUpperCase() + req.body.lname.trim().toLowerCase().slice(1);
                let fname = req.body.fname.trim()[0].toUpperCase() + req.body.fname.trim().toLowerCase().slice(1);
                let minit;
                var actualName;

                if (req.body.mname !== "") {
                    minit = req.body.mname.trim()[0].toUpperCase();
                    actualName = lname + ", " + fname + " " + minit + ".";
                } else actualName = lname + ", " + fname;

                let patientID = baseNo + patients.length;
                const patientInstance = patientModel({
                    patientID: patientID,
                    name: helper.setDefault(actualName),
                    sex: helper.setDefault(req.body.sex),
                    birthday: helper.setDefaultDate(req.body.bday),
                    age: helper.setDefaultNo(req.body.age),
                    phoneNo: helper.setDefault(req.body.pnum),
                    email: helper.setDefault(req.body.email),
                    address: helper.setDefault(req.body.address),
                    remarks: "",
                });

                patientInstance
                    .save()
                    .then(function (patient) {
                        //add patient to db
                        resp.redirect("/patient-request?id=" + patientID);
                    })
                    .catch(helper.errorFn);
            })
            .catch(helper.errorFn);
    });

    router.post("/add-patient-duplicate", function (req, resp) {
        patientModel
            .find({ name: req.body.patient_name, age: req.body.age, sex: req.body.sex })
            .then(function (patients) {
                let dup = patients.length ? true : false;
                resp.json({ dup: dup });
            })
            .catch(helper.errorFn);
    });
}

module.exports.add = add;