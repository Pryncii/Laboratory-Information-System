const global = require('./global');
const { appdata } = require("../models/data");
const helper = require('./helpers');

const {
    patientModel,
    requestModel
} = appdata;

function add(router) {
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

    router.get("/view-patients", function (req, resp) {
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
                user: global.loggedUser.name,
                fname: global.userFname[1],
            });
        });
    });

    router.post("/search-patients", function (req, resp) {
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

    router.post("/sort-patients", function (req, resp) {
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

    router.post("/reset-page", function (req, resp) {
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

    router.post("/move-page", function (req, resp) {
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
}

module.exports.add = add;