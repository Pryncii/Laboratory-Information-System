const global = require('./global');
const helper = require('./helpers');
const { appdata } = require("../models/data");

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
    router.get("/main/:pageNo", async function (req, resp) {
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
            (req.query.lowerdate !== undefined && helper.isValidDate(req.query.lowerdate)) ||
            (req.query.upperdate !== undefined && helper.isValidDate(req.query.upperdate))
        ) {
            const dateRangeQuery = {};

            if (
                req.query.lowerdate !== undefined &&
                helper.isValidDate(req.query.lowerdate)
            ) {
                const lowerDate = new Date(req.query.lowerdate);
                dateRangeQuery["$gte"] = lowerDate;
                //console.log("LowerDate " + lowerDate);
            }

            if (
                req.query.upperdate !== undefined &&
                helper.isValidDate(req.query.upperdate)
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
                            payStatus: item.payStatus
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

                global.userFname = global.loggedUser.name.split(" ");

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
                    user: global.loggedUser.name,
                    fname: global.userFname[1],
                    query: finalQuery,
                });
            })
            .catch(helper.errorFn);
    });

    router.post("/main/:id/save-edit-request", function (req, resp) {
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
                .catch(helper.errorFn);

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
                .catch(helper.errorFn);

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
                .catch(helper.errorFn);

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
                .catch(helper.errorFn);

        } else if (category === "Serology") {
            updateData = {
                requestID: requestID,
                hbsAg: data.hbsag,
                rprVdrl: data.rprvdrl,
                pregnancyTestSerum: data.pregs,
                pregnancyTestUrine: data.pregu,
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
                .catch(helper.errorFn);

        }

        resp.json({ redirect: "/main/1" });
    });

    router.post("/update-status-request-db", function (req, resp) {
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

    router.get("/main/:pageNo/gender/:requestID", function (req, res) {
        const requestID = req.params.requestID;
        requestModel.findOne({ requestID: requestID }).lean().then(function (request) {
            patientModel.findOne({ patientID: request.patientID }).lean().then(function (patient) {
                const gender = patient.sex;
                res.json({ gender: gender });
            })
        });
    });
}

module.exports.add = add;