const global = require('./global');
const { appdata } = require("../models/data");
const helper = require('./helpers');

const {
    patientModel,
    requestModel
} = appdata;

function add(router) {
    const processHistory = (patientID, requestModel) => {
        return requestModel
        .find({ patientID: patientID })
        .lean()
        .then((requests) => {
            if (!requests || requests.length === 0) {
                return [];
            }

            // Create an array of promises to process each request
            const requestPromises = requests.map((request) => {
                return new Promise((resolve) => {
                    let latestDate;

                    if (request.dateEnd == null) {
                        latestDate = new Date(3000, 0, 1);
                    } else {
                        latestDate = new Date(request.dateEnd);
                    }

                    resolve({
                        test: request.test,
                        dateStart: request.dateStart,
                        dateEnd: latestDate,
                        remarks: request.remarks,
                    });
                });
            });

            // Return a promise that resolves when all request data is processed
            return Promise.all(requestPromises);
        });
    };

    router.get("/patient-history/:patientID/:number", function (req, resp) {
        let pageData = new Array();
        let page = Number(req.params.number);
        let limit = 5; // Number of items per page
        let offset = (page - 1) * limit;
        let lockNext = false;
        let lockBack = false;

        patientModel.findOne({patientID: req.params.patientID}).lean().then(function(patient){
            processHistory(req.params.patientID, requestModel).then((requestData) => {
                // Sort by most recent
                requestData.sort((a, b) => {
                    return b.dateStart - a.dateStart; // Newest to oldest
                });

                // Format dates
                const options = { month: "long", day: "numeric", year: "numeric" };
                const defaultDate = new Date(3000, 0, 1).getTime();
                requestData.forEach((request) => {
                    request.dateEnd =
                        new Date(request.dateEnd).getTime() !== defaultDate
                            ? new Date(request.dateEnd).toLocaleDateString("en-US", options)
                            : "Unfinished";

                    request.dateStart =
                    new Date(request.dateStart).getTime() !== defaultDate
                        ? new Date(request.dateStart).toLocaleDateString("en-US", options)
                        : "Not Started";
                });

                patient.birthday = new Date(patient.birthday).getTime() !== defaultDate
                ? new Date(patient.birthday).toLocaleDateString("en-US", options)
                : "Not Listed";

                // limit to first 5 initially
                pageData = requestData.slice(offset, offset + limit);

                // check for Locks
                totalPages = Math.ceil(requestData.length / 5);
                lockNext = page >= totalPages;
                lockBack = page <= 1;
                pageBack = page - 1;
                pageNext = page + 1;

                resp.render("patient_history", {
                    layout: "index",
                    title: "Laboratory Information System",
                    patientinfo: patient,
                    pageData: pageData,
                    currentPage: page,
                    totalPages: totalPages,
                    lockNext: lockNext,
                    lockBack: lockBack,
                    pageBack: pageBack,
                    pageNext: pageNext,
                    user: global.loggedUser.name,
                    fname: global.userFname[1],
                });
            });
        });  
    });

    
}

module.exports.add = add;