//Routes
const bcrypt = require("bcrypt");
const { query } = require("express");
const { Int32 } = require("mongodb");
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { readFile } = require('fs/promises');
const bodyParser = require('body-parser');
const saltRounds = 10;
var loggedUser;
var userFname;

function add(server) {
    const responder = require("../models/data");
    const { appdata } = require("../models/data");
    const userModel = appdata.userModel;
    const patientModel = appdata.patientModel;
    const requestModel = appdata.requestModel;
    const hematologyModel = appdata.hematologyModel;
    const urinalysisModel = appdata.urinalysisModel;
    const fecalysisModel = appdata.fecalysisModel;
    const chemistryModel = appdata.chemistryModel;
    const serologyModel = appdata.serologyModel;
    server.use(bodyParser.urlencoded({extended: false}));
    server.use(bodyParser.json());
    // Use this model to look for the corresponding test
    // Note: Can't query specific values of tests, use other
    // Models to query a specific category
    const allTestModel = appdata.allTestModel;

    function errorFn(err) {
        console.log("Error found. Please trace!");
        console.error(err);
    }

    function setDefault(value, defaultValue = "N/A") {
        return value || defaultValue;
    }

    function setDefaultNo(value, defaultValue = "-1") {
        return value || defaultValue;
    }

    function setDefaultDate(value, defaultValue = new Date(0)) {
        return value ? new Date(value) : defaultValue;
    }

    function isValidDate(dateString) {
        // Check if the string can be parsed into a valid date
        return !isNaN(Date.parse(dateString));
    }

    server.get("/", function (req, resp) {
        /*
        const hematologyInstance = hematologyModel({
          requestId: 1000,
          hemoglobin: 14.2,
          hematocrit: 42.5,
          rbcCount: 5.2,
          wbcCount: 7.5,
          neutrophil: 55,
          lymphocyte: 35,
          monocyte: 6,
          eosinophil: 3,
          basophil: 1,
          withPlateletCount: true,
          plateletCount: 20000
        });
        hematologyInstance.save().then(function (user) {
         //CHANGE THIS
        }).catch(errorFn);
        */
        resp.redirect("/login");
    });

    server.get("/login", function (req, resp) {
        resp.render("login", {
            layout: "index",
            title: "Login - Laboratory Information System",
        });
    });

    server.get("/main/:pageNo", async function (req, resp) {
        // Initialize an empty search query object
        let searchQuery = { $and: [] };
        let listofID = [];

        /*
        console.log("");
        console.log("Search: " + req.query.search);
        console.log("Lower Date: " + req.query.lowerdate);
        console.log("Upper Date: " + req.query.upperdate);
        console.log("Status: " + req.query.status);
        console.log("Categories: " + req.query.category);
        console.log("Tests: " + req.query.tests);
        */

        if (req.query.search !== undefined || req.query.search !== "") {
            regex = new RegExp(req.query.search, "i");

            const patients = await patientModel.find({ name: regex });
            for (const item of patients) {
                //console.log(item.patientID);
                //console.log(item.name);
                listofID.push(item.patientID);
            }

            searchQuery.$and.push({
                $or: [
                    { category: regex },
                    { test: regex },
                    { status: regex },
                    { remarks: regex },
                    { patientID: { $in: listofID } },
                ],
            });
        }

        if (
            (req.query.lowerdate !== undefined && isValidDate(req.query.lowerdate)) ||
            (req.query.upperdate !== undefined && isValidDate(req.query.upperdate))
        ) {
            const dateRangeQuery = {};

            if (
                req.query.lowerdate !== undefined &&
                isValidDate(req.query.lowerdate)
            ) {
                const lowerDate = new Date(req.query.lowerdate);
                dateRangeQuery["$gte"] = lowerDate;
                //console.log("LowerDate " + lowerDate);
            }

            if (
                req.query.upperdate !== undefined &&
                isValidDate(req.query.upperdate)
            ) {
                const upperDate = new Date(req.query.upperdate);
                dateRangeQuery["$lte"] = upperDate;
                //console.log("UpperDate " + upperDate);
            }

            // Add date range criteria
            searchQuery.$and.push({
                $or: [{ dateStart: dateRangeQuery }, { dateEnd: dateRangeQuery }],
            });
        }

        // Check if category is defined and non-empty
        if (req.query.category !== "AA" && req.query.category !== undefined) {
            // Add category query to the search query
            searchQuery.$and.push({ category: req.query.category });
        }

        // Check if test is defined and non-empty
        if (req.query.tests !== "AAA" && req.query.tests !== undefined) {
            // Add test query to the search query
            regex2 = new RegExp(req.query.tests, "i");
            searchQuery.$and.push({ test: regex2 });
        }

        // Check if status is defined and non-empty
        if (req.query.status !== "A" && req.query.status !== undefined) {
            // Add status query to the search query
            searchQuery.$and.push({ status: req.query.status });
        }

        console.log("Search Query");
        console.log(searchQuery);

        if (searchQuery.$and.length === 0) {
            searchQuery = {};
        }

        requestModel
            .find(searchQuery)
            .then(async function (requests) {
                requests = requests.reverse();

                // console.log("requests");
                // console.log(requests);

                console.log("List successful");
                let vals = [];
                let valNo = req.params.pageNo - 1;
                let counts = 0;
                let subval = [];
                let statusColor;
                let patientNo = 1;
                let flagStatus = "";

                for (const item of requests) {
                    try {
                        const patients = await patientModel.findOne({
                            patientID: item.patientID,
                        });
                        const medtechs = await userModel.findOne({
                            medtechID: item.medtechID,
                        });
                        //Check the value of each test in chemistry and add a flag if out of range
                        const tests = await chemistryModel.findOne({
                            requestID: item.requestID,
                        });

                        if (item.status == "Completed") {
                            statusColor = "c";
                        } else if (item.status == "In Progress") {
                            statusColor = "ip";
                        } else {
                            statusColor = "";
                        }

                        // console.log(patients);

                        subval.push({
                            patientNo: patientNo,
                            requestID: item.requestID,
                            patientID: patients.patientID,
                            patientName: patients.name,
                            medtech: medtechs.name,
                            category: item.category,
                            test: item.test,
                            status: item.status,
                            dateStart: item.dateStart
                                ? item.dateStart.toLocaleString("en-US", { timeZone: "UTC" })
                                : "",
                            dateEnd: item.dateEnd
                                ? item.dateEnd.toLocaleString("en-US", { timeZone: "UTC" })
                                : "",
                            remarks: item.remarks,
                            barColor: statusColor,
                        });
                        flagStatus = "";

                        counts += 1;
                        patientNo += 1;
                        if (counts === 5) {
                            counts = 0;
                            patientNo = 1;
                            vals.push(subval);
                            subval = [];
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    }
                }

                let pageFront;
                let pageBack;
                if (subval.length > 0) {
                    vals.push(subval);
                }
                //console.log(vals);
                if (req.params.pageNo == 1) {
                    pageBack = req.params.pageNo;
                } else {
                    pageBack = Number(req.params.pageNo) - 1;
                }

                if (vals.length == req.params.pageNo) {
                    pageFront = req.params.pageNo;
                } else {
                    pageFront = Number(req.params.pageNo) + 1;
                }

                let finalQuery;
                let querySearch = [];

                if (req.query.search) {
                    querySearch.push("search=" + req.query.search);
                }

                if (req.query.lowerDate) {
                    querySearch.push("lowerDate=" + req.query.lowerDate);
                }

                if (req.query.upperDate) {
                    querySearch.push("upperDate=" + req.query.upperDate);
                }

                if (req.query.status) {
                    querySearch.push("status=" + req.query.status);
                }

                if (req.query.category) {
                    querySearch.push("category=" + req.query.category);
                }

                if (req.query.tests) {
                    querySearch.push("tests=" + req.query.tests);
                }

                if (querySearch.length > 0) {
                    finalQuery = "?";
                    finalQuery += querySearch.join("&");
                } else {
                    finalQuery = "";
                }

                userFname = loggedUser.name.split(" ");

                resp.render("main", {
                    layout: "index",
                    title: "Main - Laboratory Information System",
                    data: vals[valNo],
                    pageFirst: req.params.pageNo == 1,
                    pageLast: req.params.pageNo == vals.length,
                    pageNo: req.params.pageNo,
                    pageNoNext: pageFront,
                    pageNoBack: pageBack,
                    pageNoCap: vals.length,
                    user: loggedUser.name,
                    fname: userFname[1],
                    query: finalQuery,
                });
            })
            .catch(errorFn);
    });

    server.post("/main/:id/save-edit-request", function (req, resp) {
        let category = req.body.category;
        let data = req.body.data[0];
        let requestID = req.body.requestID;
        console.log(category);
        console.log(data);
        console.log(requestID);
        let updateData;
        if (category === "Hematology") {
            if (data.pltc) {
                updateData = {
                    hemoglobin: data.hemo,
                    hematocrit: data.hema,
                    rbcCount: data.rbc,
                    wbcCount: data.wbc,
                    neutrophil: data.neut,
                    lymphocyte: data.lymp,
                    monocyte: data.mono,
                    eosinophil: data.eosi,
                    basophil: data.baso,
                    plateletCount: data.pltc
                };
            } else {
                updateData = {
                    hemoglobin: data.hemo,
                    hematocrit: data.hema,
                    rbcCount: data.rbc,
                    wbcCount: data.wbc,
                    neutrophil: data.neut,
                    lymphocyte: data.lymp,
                    monocyte: data.mono,
                    eosinophil: data.eosi,
                    basophil: data.baso,
                };
            }
            hematologyModel
                .findOneAndUpdate(
                    { requestID: requestID },
                    { $set: updateData }, // Use $set to only update specified fields
                    { new: true, upsert: true }
                )
                .then(function (test) {
                    console.log("successfully updated test");
                })
                .catch(errorFn);

        } else if (category === "Urinalysis") {
            updateData = {
                color: data.clr,
                transparency: data.trans,
                pH: data.ph,
                specificGravity: data.spgrav,
                sugar: data.sug,
                protein: data.pro,
                pus: data.pus,
                rbc: data.rbc,
                bacteria: data.bac,
                epithelialCells: data.epi,
                mucusThread: data.muc
            };
            urinalysisModel
                .findOneAndUpdate(
                    { requestID: requestID },
                    { $set: updateData }, // Use $set to update only the specified fields
                    { new: true, upsert: true }
                )
                .then(function (test) {
                    console.log("successfully updated test");
                })
                .catch(errorFn);

        } else if (category === "Fecalysis") {
            updateData = {
                color: data.clr,
                consistency: data.cons,
                wbc: data.wbc,
                rbc: data.rbc,
                bacteria: data.bac,
                ovaParasite: data.ovapar,
                fatGlobule: data.fat,
                bileCrystal: data.bile,
                vegetableFiber: data.veg,
                meatFiber: data.meat,
                pusCells: data.pus,
                erythrocyte: data.eryth,
                yeastCell: data.yeast
            };

            fecalysisModel
                .findOneAndUpdate(
                    { requestID: requestID },
                    { $set: updateData }, // Use $set to update only the specified fields
                    { new: true, upsert: true }
                )
                .then(function (test) {
                    console.log("successfully updated test");
                })
                .catch(errorFn);

        } else if (category === "Chemistry") {
            updateData = {
                fbs: data.fbs,
                creatinine: data.crt,
                uricAcid: data.uric,
                cholesterol: data.chol,
                triglycerides: data.tri,
                hdl: data.hdl,
                ldl: data.ldl,
                vldl: data.vldl,
                bun: data.bun,
                sgpt: data.sgpt,
                sgot: data.sgot,
                hba1c: data.hba1c
            };

            chemistryModel
                .findOneAndUpdate(
                    { requestID: requestID },
                    { $set: updateData }, // Use $set to update only the specified fields
                    { new: true, upsert: true }
                )
                .then(function (test) {
                    console.log("successfully updated test");
                })
                .catch(errorFn);

        } else if (category === "Serology") {
            updateData = {
                requestID: requestID,
                hbsAg: data.hbsag,
                rprVdrl: data.rprvdrl,
                pregnancyTestSerum: data.preg,
                pregnancyTestUrine: data.preg,
                dengueNs1: data.dengN,
                dengueDuo: data.dengD,
            };

            serologyModel
                .findOneAndUpdate(
                    { requestID: requestID },
                    { $set: updateData }, // Use $set to update only the specified fields
                    { new: true, upsert: true }
                )
                .then(function (test) {
                    console.log("successfully updated test");
                })
                .catch(errorFn);

        }

        resp.json({ redirect: "/main/1" });
    });

    server.get("/register", function (req, resp) {
        resp.render("register", {
            layout: "index",
            title: "Register - Laboratory Information System",
        });
    });

    server.get("/addpatient", function (req, resp) {
        resp.render("add_patient", {
            layout: "index",
            title: "Add Patient - Laboratory Information System",
            user: loggedUser.name,
            fname: userFname[1],
        });
    });

    server.post("/login-validation", function (req, resp) {
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
                                loggedUser = user;
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

    const processPatients = (search, patientModel, requestModel) => {
        return patientModel
            .find()
            .lean()
            .then((patients) => {
                // Filter patients based on search query
                const filteredPatients = patients.filter((patient) => {
                    if (
                        search &&
                        patient.name.toLowerCase().includes(search.toLowerCase())
                    ) {
                        return true;
                    }
                    return false;
                });

                // Determine which patients to process
                const patientsToProcess = search ? filteredPatients : patients;

                // Create an array of promises to fetch request data for each patient
                const promises = patientsToProcess.map((patient) => {
                    return requestModel
                        .find({ patientID: patient.patientID })
                        .lean()
                        .then((requests) => {
                            const dates = requests.map((request) => {
                                return {
                                    date: new Date(request.dateStart),
                                    remarks: request.remarks,
                                };
                            });
                            let latestDate = new Array();

                            if (dates.length === 0) {
                                latestDate = {
                                    date: new Date(1960, 0, 1),
                                    remarks: "",
                                };
                            } else {
                                dates.sort((a, b) => b.date - a.date);
                                latestDate = dates[0];
                            }
                            return {
                                patientID: patient.patientID,
                                name: patient.name,
                                latestDate: latestDate.date,
                                remarks: latestDate.remarks,
                            };
                        });
                });

                // Return a promise that resolves when all patient data is processed
                return Promise.all(promises);
            });
    };

    server.get("/viewpatients", function (req, resp) {
        let pageData = new Array();
        let lockNext = false;
        let lockBack = false;
        let start = 1;
        let end;
        processPatients("", patientModel, requestModel).then((patientData) => {
            // Sort by most recent
            patientData.sort((a, b) => {
                return b.latestDate - a.latestDate; // Newest to oldest
            });

            // Format dates
            patientData.forEach((patient) => {
                const options = { month: "long", day: "numeric", year: "numeric" };

                const defaultDate = new Date(1960, 0, 1).getTime();

                patient.latestDate =
                    new Date(patient.latestDate).getTime() !== defaultDate
                        ? new Date(patient.latestDate).toLocaleDateString("en-US", options)
                        : "No Requests";
            });

            // limit to first 5 initially
            pageData = patientData.slice(0, 5);

            // chedck for Locks
            end = Math.ceil(patientData.length / 5);
            start = end === 0 ? 0 : start;
            lockNext = start === end ? true : false;
            lockBack = start === 1 || start === 0 ? true : false;

            resp.render("view_patients", {
                layout: "index",
                title: "Laboratory Information System",
                pageData: pageData,
                start: start,
                end: end,
                lockNext: lockNext,
                lockBack: lockBack,
                user: loggedUser.name,
                fname: userFname[1],
            });
        });
    });

    server.post("/search-Patients", function (req, resp) {
        let sort = req.body.sort;
        let pageData = new Array();
        let lockNext = false;
        let lockBack = false;
        let start = 1;
        let end;
        processPatients(req.body.search.trim(), patientModel, requestModel).then(
            (patientData) => {
                // Sort Last Name
                if (sort === "N") {
                    let name = req.body.name;
                    patientData.sort((a, b) => {
                        const nameA = a.name.toUpperCase();
                        const nameB = b.name.toUpperCase();
                        if (name[name.length - 1] === "Z") {
                            //if A-Z change to Z-A
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                        } else {
                            if (nameA < nameB) {
                                return 1;
                            }
                            if (nameA > nameB) {
                                return -1;
                            }
                        }
                        return 0;
                    });
                }

                // Sort by Date
                if (sort === "D") {
                    let date = req.body.date;
                    patientData.sort((a, b) => {
                        if (date[0] === "R") {
                            return b.latestDate - a.latestDate; // Newest to oldest
                        } else {
                            return a.latestDate - b.latestDate; // Oldest to newest
                        }
                    });
                }

                patientData.forEach((patient) => {
                    const options = { month: "long", day: "numeric", year: "numeric" };

                    const defaultDate = new Date(1960, 0, 1).getTime();

                    patient.latestDate =
                        new Date(patient.latestDate).getTime() !== defaultDate
                            ? new Date(patient.latestDate).toLocaleDateString(
                                "en-US",
                                options
                            )
                            : "No Requests";
                });

                // limit to first 5
                pageData = patientData.slice(0, 5);

                // chedck for Locks
                end = Math.ceil(patientData.length / 5);
                start = end === 0 ? 0 : start;
                lockNext = start === end ? true : false;
                lockBack = start === 1 || start === 0 ? true : false;

                resp.json({
                    pageData: pageData,
                    start: start,
                    end: end,
                    lockNext: lockNext,
                    lockBack: lockBack,
                });
            }
        );
    });

    server.post("/sort-Patients", function (req, resp) {
        let search = req.body.hasSearched === "true" ? req.body.search.trim() : "";
        let pageData = new Array();
        let lockNext = false;
        let lockBack = false;
        let start = 1;
        let end;
        processPatients(search, patientModel, requestModel).then((patientData) => {
            let nameBtn_text = "";
            if (req.body.name) {
                let name = req.body.name;
                nameBtn_text =
                    name[name.length - 1] !== "Z" ? "Last Name A-Z" : "Last Name Z-A";
                patientData.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (name[name.length - 1] !== "Z") {
                        //if A-Z change to Z-A
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                    } else {
                        if (nameA < nameB) {
                            return 1;
                        }
                        if (nameA > nameB) {
                            return -1;
                        }
                    }
                    return 0;
                });
            }

            let dateBtn_text = "";
            if (req.body.date) {
                let date = req.body.date;
                dateBtn_text =
                    date[0] !== "R" ? "Recently Modified" : "Oldest Modified";
                patientData.sort((a, b) => {
                    if (date[0] !== "R") {
                        return b.latestDate - a.latestDate; // Newest to oldest
                    } else {
                        return a.latestDate - b.latestDate; // Oldest to newest
                    }
                });
            }

            patientData.forEach((patient) => {
                const options = { month: "long", day: "numeric", year: "numeric" };

                const defaultDate = new Date(1960, 0, 1).getTime();

                patient.latestDate =
                    new Date(patient.latestDate).getTime() !== defaultDate
                        ? new Date(patient.latestDate).toLocaleDateString("en-US", options)
                        : "No Requests";
            });

            // limit to first 5
            pageData = patientData.slice(0, 5);

            // chedck for Locks
            end = Math.ceil(patientData.length / 5);
            start = end === 0 ? 0 : start;
            lockNext = start === end ? true : false;
            lockBack = start === 1 || start === 0 ? true : false;

            resp.json({
                pageData: pageData,
                nameBtn_text: nameBtn_text,
                dateBtn_text: dateBtn_text,
                start: start,
                end: end,
                lockNext: lockNext,
                lockBack: lockBack,
            });
        });
    });

    server.post("/reset-Page", function (req, resp) {
        let pageData = new Array();
        let lockNext = false;
        let lockBack = false;
        let start = 1;
        let end;
        let nameBtn_text = "Last Name A-Z";
        let dateBtn_text = "Recently Modified";


        processPatients("", patientModel, requestModel).then((patientData) => {
            // Sort by most recent
            patientData.sort((a, b) => {
                return b.latestDate - a.latestDate; // Newest to oldest
            });

            // Format dates
            patientData.forEach((patient) => {
                const options = { month: "long", day: "numeric", year: "numeric" };

                const defaultDate = new Date(1960, 0, 1).getTime();

                patient.latestDate =
                    new Date(patient.latestDate).getTime() !== defaultDate
                        ? new Date(patient.latestDate).toLocaleDateString("en-US", options)
                        : "No Requests";
            });

            // limit to first 5 initially
            pageData = patientData.slice(0, 5);

            // chedck for Locks
            end = Math.ceil(patientData.length / 5);
            start = end === 0 ? 0 : start;
            lockNext = start === end ? true : false;
            lockBack = start === 1 || start === 0 ? true : false;

            resp.json({
                pageData: pageData,
                nameBtn_text: nameBtn_text,
                dateBtn_text: dateBtn_text,
                start: start,
                end: end,
                lockNext: lockNext,
                lockBack: lockBack,
            });
        });
    });

    server.post("/move-Page", function (req, resp) {
        let search = req.body.hasSearched === "true" ? req.body.search.trim() : "";
        let pageDetails = req.body.pageNum.trim().split(" ");
        let sort = req.body.sort;
        let start = parseInt(pageDetails[1]);
        let end = pageDetails[3];

        processPatients(search, patientModel, requestModel).then((patientData) => {
            let pageData = new Array();

            // Sort Last Name
            if (sort === "N") {
                let name = req.body.name;
                patientData.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (name[name.length - 1] === "Z") {
                        //if A-Z change to Z-A
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                    } else {
                        if (nameA < nameB) {
                            return 1;
                        }
                        if (nameA > nameB) {
                            return -1;
                        }
                    }
                    return 0;
                });
            }

            // Sort by Date
            if (sort === "D") {
                let date = req.body.date;
                patientData.sort((a, b) => {
                    if (date[0] === "R") {
                        return b.latestDate - a.latestDate; // Newest to oldest
                    } else {
                        return a.latestDate - b.latestDate; // Oldest to newest
                    }
                });
            }

            start += parseInt(req.body.move) ? 1 : -1;
            let lockNext = start === parseInt(end) ? true : false;
            let lockBack = start === 1 ? true : false;

            pageData = patientData.slice(start * 5 - 5, start * 5);

            patientData.forEach((patient) => {
                const options = { month: "long", day: "numeric", year: "numeric" };

                const defaultDate = new Date(1960, 0, 1).getTime();

                patient.latestDate =
                    new Date(patient.latestDate).getTime() !== defaultDate
                        ? new Date(patient.latestDate).toLocaleDateString("en-US", options)
                        : "No Requests";
            });

            resp.json({
                pageData: pageData,
                start: start,
                end: end,
                lockNext: lockNext,
                lockBack: lockBack,
            });
        });
    });

    //adds to the database the user details upon registering
    server.post("/adduser-db", function (req, resp) {
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
                                name: setDefault(fullName),
                                username: setDefault(req.body.username),
                                email: setDefault(req.body.email),
                                sex: setDefault(req.body.sex),
                                password: hash,
                                prcno: setDefault(req.body.prc),
                            });
                            userInstance
                                .save()
                                .then(function (user) {
                                    resp.redirect("/login"); //CHANGE THIS
                                })
                                .catch(errorFn);
                            return;
                        });
                    });
                }
            });
    });

    server.post("/addpatient-db", function (req, resp) {
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
                    name: setDefault(actualName),
                    sex: setDefault(req.body.sex),
                    birthday: setDefaultDate(req.body.bday),
                    age: setDefaultNo(req.body.age),
                    phoneNo: setDefault(req.body.pnum),
                    email: setDefault(req.body.email),
                    address: setDefault(req.body.address),
                    remarks: "",
                });

                patientInstance
                    .save()
                    .then(function (patient) {
                        //add patient to db
                        resp.redirect("/patient-request?id=" + patientID);
                    })
                    .catch(errorFn);
            })
            .catch(errorFn);
    });

    server.post("/addpatient-duplicate", function (req, resp) {
        patientModel
            .find({ name: req.body.patient_name, age: req.body.age, sex: req.body.sex })
            .then(function (patients) {
                let dup = patients.length ? true : false;
                resp.json({ dup: dup });
            })
            .catch(errorFn);
    });

    //add request here
    server.get("/patient-request", function (req, resp) {
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
                user: loggedUser.name,
                fname: userFname[1],
                patientname: patientname
            });

        });
    });

    server.get("/add-patientrequest", function (req, resp) {
        let patientID = req.query.patientID;
        let medtechID = loggedUser.medtechID;
        let category = req.query.category;
        let test = req.query.test;
        let baseNumber = 1000;
        let status = "Requested";
        let dateStart = new Date(new Date().getTime() + (8 * 60 * 60 * 1000));
        let dateEnd = null;
        let remarks = "";


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
                if (test.includes('fbs')) {
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
                    hbsAgVal = -1;
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
            });
            requestInstance.save().then(async function () {
                resp.redirect("/main/1");
            });
        });
    });

    server.post("/update-status-request-db", function (req, resp) {
        const { requestID, status, remarks } = req.body;
        let dateEnd;
        let date = new Date();
        console.log("====================" + date);


        if (status === "Completed") dateEnd = new Date(date.getTime() + (8 * 60 * 60 * 1000));

        const updateValues = {
            $set: {
                status: status,
                dateEnd: dateEnd,
                remarks: remarks,
            },
        };

        requestModel.updateOne({ requestID: requestID }, updateValues)
            .then(async function (updatedRequest) {
                if (updatedRequest) {
                    // If the update was successful, redirect back to the main page
                    resp.redirect("/main/1");
                } else {
                    // If the request was not found, respond with a 404 error
                    resp
                        .status(404)
                        .json({ success: false, message: "Request not found" });
                }
            })
            .catch(function (error) {
                console.error(error);
                resp
                    .status(500)
                    .json({ success: false, message: "Error updating request" });
            });
    });

    server.post('/generate-pdf-hematology', async (req, res) => {
        const [{
            hemo,
            hema,
            rbc,
            wbc,
            neut,
            lymp,
            mono,
            eosi,
            baso,
            pltc
        }] = req.body;

            console.log('Received data:', req.body);  // Log the received data

            try {
                const pdfDoc = await PDFDocument.load(await readFile('HematologyTemplate.pdf'));
                const form = pdfDoc.getForm();
                const fields = form.getFields();
        
                // Define the Times New Roman font
                const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                console.log(fields.map(field => field.getName())); 
                // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
                fields.forEach(field => {
                    field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
                });
    
                // Set values for specific fields by their names
                form.getTextField('Hemoglobin').setText(hemo);
                form.getTextField('Hematocrit').setText(hema);
                form.getTextField('RBC Count').setText(rbc);
                form.getTextField('WBC Count').setText(wbc);
                form.getTextField('Neutrophil').setText(neut);
                form.getTextField('Lymphocyte').setText(lymp);
                form.getTextField('Eosinophil').setText(eosi);
                form.getTextField('Basophil').setText(baso);
                form.getTextField('Monocyte').setText(mono);
                form.getTextField('Platelet Count').setText(pltc);
    
        
                // Flatten the form to make fields non-editable and set appearances
                form.flatten();
        
                // Save the filled and flattened PDF
                const pdfBytes = await pdfDoc.save();
        
                // Set response to download the generated PDF
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
                res.send(Buffer.from(pdfBytes));
        
                console.log('PDF generated successfully');  // Log successful generation
            } catch (error) {
                console.log('Error generating PDF:', error);  // Log any errors
                res.status(500).send('Error generating PDF');
            }
    });
    server.post('/generate-pdf-clinical-microscopy', async (req, res) => {
        const [{
            clr_urine,
            trans, 
            ph,
            spgrav,
            sug,
            pro,
            pus_urine,
            rbc_urine,
            bac_urine,
            epi,
            muc,
            clr_fecal,
            consistency,
            pus_fecal,
            rbc_fecal,
            ova,
            fatGlob,
            bileCrystal,
            vegetableFiber,
            meatFiber,
            erythrocyte,
            yeast,
            bac_fecal
        }] = req.body;

        console.log('Received data:', req.body);  // Log the received data

        try {
            const pdfDoc = await PDFDocument.load(await readFile('ClinicalMicroscopyTemplate.pdf'));
            const form = pdfDoc.getForm();
            const fields = form.getFields();
        
            // Define the Times New Roman font
            const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            console.log(fields.map(field => field.getName())); 
            // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
            fields.forEach(field => {
                field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
            });
        
            // Set values for specific fields by their names
            form.getTextField('Color_Urinal').setText(clr_urine);
            form.getTextField('Transparency').setText(trans);
            form.getTextField('pH').setText(ph);
            form.getTextField('Specific_Gravity').setText(spgrav);
            form.getTextField('Sugar').setText(sug);
            form.getTextField('Protein').setText(pro);
            form.getTextField('Pus_Urinal').setText(pus_urine);
            form.getTextField('RBC_Urinal').setText(rbc_urine);
            form.getTextField('Bacteria_Urinal').setText(bac_urine);
            form.getTextField('Epithelial_Cells').setText(epi);
            form.getTextField('Mucus_Thread').setText(muc);
            form.getTextField('Color_Fecal').setText(clr_fecal);
            form.getTextField('Consistency').setText(consistency);
            form.getTextField('Pus_Fecal').setText(pus_fecal);
            form.getTextField('RBC_Fecal').setText(rbc_fecal);
            form.getTextField('Ova').setText(ova);
            form.getTextField('Fat_Globule').setText(fatGlob);
            form.getTextField('Bile_Crystal').setText(bileCrystal);
            form.getTextField('Vegetable_Fiber').setText(vegetableFiber);
            form.getTextField('Meat_Fiber').setText(meatFiber);
            form.getTextField('Erythrocyte').setText(erythrocyte);
            form.getTextField('Yeast_Cells').setText(yeast);
            form.getTextField('Bacteria_Fecal').setText(bac_fecal);
    
        
                // Flatten the form to make fields non-editable and set appearances
                form.flatten();
        
                // Save the filled and flattened PDF
                const pdfBytes = await pdfDoc.save();
        
                // Set response to download the generated PDF
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
                res.send(Buffer.from(pdfBytes));
        
                console.log('PDF generated successfully');  // Log successful generation
            } catch (error) {
                console.log('Error generating PDF:', error);  // Log any errors
                res.status(500).send('Error generating PDF');
            }
    });
    server.post('/generate-pdf-chemistry', async (req, res) => {
        const [{
            fbs,
            crt,
            uric,
            chol,
            tri,
            hdl,
            ldl,
            vldl,
            bun,
            sgpt,
            sgot,
            hba1c
        }] = req.body;

            console.log('Received data:', req.body);  // Log the received data

            try {
                const pdfDoc = await PDFDocument.load(await readFile('Chemistry-Template.pdf'));
                const form = pdfDoc.getForm();
                const fields = form.getFields();
        
                // Define the Times New Roman font
                const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                console.log(fields.map(field => field.getName())); 
                // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
                fields.forEach(field => {
                    field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
                });
    
                // Set values for specific fields by their names
                form.getTextField('Glucose').setText(fbs);
                form.getTextField('Creatinine').setText(crt);
                form.getTextField('Uric_Acid').setText(uric);
                form.getTextField('Cholesterol_Total').setText(chol);
                form.getTextField('Triglycerides').setText(tri);
                form.getTextField('Cholesterol_HDL').setText(hdl);
                form.getTextField('Cholesterol_LDL').setText(ldl);
                form.getTextField('VLDL').setText(vldl);
                form.getTextField('BUN').setText(bun);
                form.getTextField('SGPT').setText(sgpt);
                form.getTextField('SGOT').setText(sgot);
                form.getTextField('HBA1C').setText(hba1c);
        
                // Flatten the form to make fields non-editable and set appearances
                form.flatten();
        
                // Save the filled and flattened PDF
                const pdfBytes = await pdfDoc.save();
        
                // Set response to download the generated PDF
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
                res.send(Buffer.from(pdfBytes));
        
                console.log('PDF generated successfully');  // Log successful generation
            } catch (error) {
                console.log('Error generating PDF:', error);  // Log any errors
                res.status(500).send('Error generating PDF');
            }
    });
}

server.post('/generate-pdf-serology', async (req, res) => {
    const [{
        hbsAg,
        urine,
        RPR,
        dengueNs1,
        serum,
        duo
    }] = req.body;

        console.log('Received data:', req.body);  // Log the received data

        try {
            const pdfDoc = await PDFDocument.load(await readFile('SerologyTemplate.pdf'));
            const form = pdfDoc.getForm();
            const fields = form.getFields();
    
            // Define the Times New Roman font
            const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            console.log(fields.map(field => field.getName())); 
            // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
            fields.forEach(field => {
                field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
            });

            // Set values for specific fields by their names
            form.getTextField('HbsAg').setText(hbsAg);
            form.getTextField('Urine').setText(urine);
            form.getTextField('RPR').setText(RPR);
            form.getTextField('NS1').setText(dengueNs1);
            form.getTextField('Serum').setText(serum);
            form.getTextField('Duo').setText(duo);


    
            // Flatten the form to make fields non-editable and set appearances
            form.flatten();
    
            // Save the filled and flattened PDF
            const pdfBytes = await pdfDoc.save();
    
            // Set response to download the generated PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
            res.send(Buffer.from(pdfBytes));
    
            console.log('PDF generated successfully');  // Log successful generation
        } catch (error) {
            console.log('Error generating PDF:', error);  // Log any errors
            res.status(500).send('Error generating PDF');
        }
});


module.exports.add = add;

//?search={{searchWord}}&lowerdate={{lowDate}}&upperdate={{upDate}}&status={{requestStatus}}&category={{requestCategory}}&tests={{testName}}