const bcrypt = require("bcrypt");
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

const saltRounds = 10;

function add(router) {
    router.get("/login", function (req, resp) {
        resp.render("login", {
            layout: "index",
            title: "Login - Laboratory Information System",
        });
    });

    router.get("/register", function (req, resp) {
        resp.render("register", {
            layout: "index",
            title: "Register - Laboratory Information System",
        });
    });

    router.post("/login-validation", function (req, resp) {
        userModel
            .findOne({ username: req.body.username })
            .lean()
            .then(function (user) {
                if (user != undefined && user._id != null) {
                    bcrypt.compare(
                        req.body.password,
                        user.password,
                        function (err, result) {
                            if (result) {
                                global.loggedUser = user;
                                resp.redirect("/main/1");
                                return;
                            } else {
                                resp.redirect("/login");
                                return;
                            }
                        }
                    );
                } else {
                    resp.redirect("/login");
                    return;
                }
            });
    });

    //adds to the database the user details upon registering
    router.post("/add-user-db", function (req, resp) {
        userModel
            .findOne({
                $or: [{ username: req.body.username }, { email: req.body.email }],
            })
            .then(function (user) {
                if (user) {
                    resp.redirect("/register");
                } else {
                    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                        let baseNo = 100;
                        userModel.find({}).then(function (users) {
                            var fullName =
                                req.body.lname + ", " + req.body.fname + " " + req.body.mname;
                            const userInstance = userModel({
                                medtechID: baseNo + users.length,
                                name: helper.setDefault(fullName),
                                username: helper.setDefault(req.body.username),
                                email: helper.setDefault(req.body.email),
                                sex: helper.setDefault(req.body.sex),
                                password: hash,
                                prcno: helper.setDefault(req.body.prc),
                            });
                            userInstance
                                .save()
                                .then(function (user) {
                                    resp.redirect("/login"); //CHANGE THIS
                                })
                                .catch(helper.errorFn);
                            return;
                        });
                    });
                }
            });
    });
}

module.exports.add = add;