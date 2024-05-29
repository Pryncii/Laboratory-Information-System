//Routes
const bcrypt = require("bcrypt");
const { Int32 } = require("mongodb");
const saltRounds = 10;
var loggedUser;

function add(server) {
  const responder = require('../models/data');
  const { appdata } = require('../models/data');
  const userModel = appdata.userModel;
  const patientModel = appdata.patientModel;
  const requestModel = appdata.requestModel;

  function errorFn(err) {
    console.log('Error found. Please trace!');
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

  server.get('/', function (req, resp) {
    resp.redirect("/login");
  });

  server.get('/login', function (req, resp) {
    resp.render('login', {
      layout: 'index',
      title: 'Login - Laboratory Information System'
    });
  });

  server.get('/main/:pageNo', function (req, resp) {
  // Initialize an empty search query object
    let searchQuery = {};

    console.log("");
    console.log("Search: " + req.query.search);
    console.log("Lower Date: " + req.query.lowerdate);
    console.log("Upper Date: " + req.query.upperdate);
    console.log("Status: " + req.query.status);
    console.log("Categories: " + req.query.category);
    console.log("Tests: " + req.query.tests);

    if(req.query.search !== undefined || req.query.search !== "")
    {
      let listofID = [];
      regex = new RegExp(req.query.search, 'i');
      patientModel.find({ name: regex } ).then(function(patients){
        for (const item of patients) {
          console.log(item.patientID);
          console.log(item.name);
          //listofID.push(item.patientID);
        }
      });

      //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      //console.log(listofID);

        searchQuery = {
          $or: [
              { category: regex },
              { status: regex },
              { remarks: regex },
              //{ patientID: listofID }
          ]
        };
    }

    if ((req.query.lowerdate !== undefined && isValidDate(req.query.lowerdate)) || (req.query.upperdate !== undefined && isValidDate(req.query.upperdate))) {
        // Construct the price range query
        const dateRangeQuery = {};

        if (req.query.lowerdate !== undefined && isValidDate(req.query.lowerdate)) {
          const lowerDate = new Date(req.query.lowerdate);
          dateRangeQuery['$gte'] = lowerDate;
          console.log("LowerDate " + lowerDate);
        }
  
        if (req.query.upperdate !== undefined && isValidDate(req.query.upperdate)) {
          const upperDate = new Date(req.query.upperdate);
          dateRangeQuery['$lte'] = upperDate;
          console.log("UpperDate " + upperDate);
        }
  
        // Include the date range query in the overall search query
        searchQuery.dateStart = dateRangeQuery;
        searchQuery.dateEnd = dateRangeQuery;
        searchQuery = {
          $or: [
              { dateStart: searchQuery.dateStart },
              { dateEnd: searchQuery.dateEnd},
          ]
        };
    }

    

    // Check if category is defined and non-empty
    if (req.query.category !== 'AA' && req.query.category !== undefined) {
        // Add category query to the search query
        searchQuery.category = req.query.category;
    }

    // Check if category is defined and non-empty
    if (req.query.status !== 'A' && req.query.status !== undefined) {
      // Add category query to the search query
      searchQuery.status = req.query.status;
    }

    console.log("Search Query");
    console.log(searchQuery);

    requestModel.find(searchQuery)
  .then(async function(requests) {
    requests = requests.reverse();
    console.log('List successful');
    let vals = [];
    let valNo = req.params.pageNo - 1;
    let counts = 0;
    let subval = [];
    let statusColor;
    for (const item of requests) {
      try {
        const patients = await patientModel.findOne({patientID: item.patientID});
        const medtechs = await userModel.findOne({medtechID: item.medtechID});

        if(item.status == "Completed"){
          statusColor = "c";
        } else if (item.status == "In Progress"){
          statusColor = "ip";
        } else {
          statusColor = "";
        }


        //console.log(patients);
        subval.push({
          patientID: patients.patientID,
          patientName: patients.name,
          medtech: medtechs.name,
          category: item.category,
          status: item.status,
          dateStart: item.dateStart ? item.dateStart.toLocaleString('en-US', { timeZone: 'UTC' }): '',
          dateEnd: item.dateEnd ? item.dateEnd.toLocaleString('en-US', {timeZone: 'UTC'}) : '',
          remarks: item.remarks,
          barColor: statusColor,
        });

        counts += 1;
        if (counts === 5) {
          counts = 0;
          vals.push(subval);
          subval = [];
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    let pageFront;
    let pageBack;
    vals.push(subval);
    //console.log(vals);
    if(req.params.pageNo == 1){
      pageBack = req.params.pageNo;
    } else {
      pageBack = Number(req.params.pageNo) - 1;
    }

    if(vals.length == req.params.pageNo){
      pageFront = req.params.pageNo;
    } else {
      pageFront = Number(req.params.pageNo) + 1;
    }

    console.log("Search: " + req.query.search);
    console.log("Lower Date: " + req.query.lowerdate);
    console.log("Upper Date: " + req.query.upperdate);
    console.log("Status: " + req.query.status);
    console.log("Categories: " + req.query.category);
    console.log("Tests: " + req.query.tests);
    resp.render('main', {
      layout: 'index',
      title: 'Main - Laboratory Information System',
      data: vals[valNo],
      pageNo: req.params.pageNo,
      pageNoNext: pageFront,
      pageNoBack: pageBack,
      pageNoCap: vals.length,
      user: loggedUser.name,
      searchWord: req.query.search,
      lowDate: req.query.lowerdate,
      upDate: req.query.upperdate,
      requestStatus: req.query.status,
      requestCategory: req.query.category,
      testName: req.query.tests
    });
  })
  .catch(errorFn);


  });

  server.get('/register', function (req, resp) {
    resp.render('register', {
      layout: 'index',
      title: 'Register - Laboratory Information System'
    });

  });
  
  server.get('/addpatient', function(req, resp){
    resp.render('addpatient',{
      layout: 'index',
      title: 'Add Patient - Laboratory Information System',
      user: loggedUser.name
    });
  });

  const processPatients = (search, patientModel, requestModel) => {
    return patientModel
      .find()
      .lean()
      .then(patients => {
        // Filter patients based on search query
        const filteredPatients = patients.filter(patient => {
          if (search && patient.name.toLowerCase().includes(search.toLowerCase())) {
            return true;
          }
          return false;
        });
  
        // Determine which patients to process
        const patientsToProcess = search ? filteredPatients : patients;
  
        // Create an array of promises to fetch request data for each patient
        const promises = patientsToProcess.map(patient => {
          return requestModel
            .find({ patientID: patient.patientID })
            .lean()
            .then(requests => {
              const dates = requests.map(request => {
                return {
                  date: new Date(request.dateStart),
                  remarks: request.remarks
                };
              });
              console.log(patient.patientID);
              console.log(patient.name);
              console.log(dates);
              let  latestDate = new Array();
              
              if(dates.length === 0){
                latestDate = {
                  date: new Date(1960, 0, 1), 
                  remarks: ""
                }
              }else{
                dates.sort((a, b) => b.date - a.date);
                latestDate = dates[0];
              }
              return {
                patientID: patient.patientID,
                name: patient.name,
                latestDate: latestDate.date,
                remarks: latestDate.remarks
              };
            });
        });
  
        // Return a promise that resolves when all patient data is processed
        return Promise.all(promises);
      });
  };
  server.post("/login-validation", function (req, resp) {
    userModel.findOne({ username: req.body.username }).lean().then(function (user) {
      if (user != undefined && user._id != null) {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
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

  server.get('/viewpatients', function(req, resp){
      patientModel
        .find()
        .lean()
        .then(function(patients){
          const filteredPatients = patients.filter(patient => {
            if (req.query.search && patient.name.toLowerCase().includes(req.query.search.toLowerCase())) {
                return true;
            }
            return false;
          });

          const patientsToProcess = req.query.search ? filteredPatients : patients;

          const promises = patientsToProcess.map(patient => {
            return requestModel
              .find({patient: patient.patientID})
              .lean()
              .then(function(requests){
                const dates = requests.map(request => new Date(request.dateStart));
                const latestDate = new Date(Math.max(...dates));

                return {
                  patientID: patient.patientID,
                  name: patient.name,
                  latestDate: latestDate,
                  remarks: patient.remarks
                };
              });
          });

          return Promise.all(promises)
            .then(patientData => {
              // Format dates
              patientData.forEach(patient => {
                const options = { month: 'long', day: 'numeric', year: 'numeric' };
                patient.latestDate = patient.latestDate.toLocaleDateString('en-US', options);
              });

              // Sort patientData by name  A-Z
              patientData.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
              });
              
              //check
              console.log(patientData);

              resp.render('view_patients', {
                layout: 'index',
                title: 'Laboratory Information System',
                patientData: patientData,
                user: loggedUser.name
              });
          });
        })
      .catch(errorFn);
  });

  server.post("/sort-Patients", function(req, resp){
    patientModel
      .find()
      .lean()
      .then(patients => {
        // Filter patients based on search query
        const filteredPatients = patients.filter(patient => {
          if (search && patient.name.toLowerCase().includes(search.toLowerCase())) {
            return true;
          }
          return false;
        });
  
        // Determine which patients to process
        const patientsToProcess = search ? filteredPatients : patients;
  
        // Create an array of promises to fetch request data for each patient
        const promises = patientsToProcess.map(patient => {
          return requestModel
            .find({ patientID: patient.patientID })
            .lean()
            .then(requests => {
              const dates = requests.map(request => {
                return {
                  date: new Date(request.dateStart),
                  remarks: request.remarks
                };
              });
              console.log(patient.patientID);
              console.log(patient.name);
              console.log(dates);
              let  latestDate = new Array();
              
              if(dates.length === 0){
                latestDate = {
                  date: new Date(1960, 0, 1), 
                  remarks: ""
                }
              }else{
                dates.sort((a, b) => b.date - a.date);
                latestDate = dates[0];
              }
              return {
                patientID: patient.patientID,
                name: patient.name,
                latestDate: latestDate.date,
                remarks: latestDate.remarks
              };
            });
        });
  
        // Return a promise that resolves when all patient data is processed
        return Promise.all(promises);
      });
  });

  server.get('/viewpatients', function(req, resp){
    let pageData = new Array();
    let lockNext = false;
    let lockBack = false;
    let start = 1;
    let end;
    processPatients("", patientModel, requestModel)
      .then(patientData => {
        // Sort by most recent
        patientData.sort((a, b) => {
          return b.latestDate - a.latestDate; // Newest to oldest
        });
        
        // Format dates
        patientData.forEach(patient => {
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          
          const defaultDate = new Date(1960, 0, 1).getTime();

          patient.latestDate = (new Date(patient.latestDate).getTime() !== defaultDate)
            ? new Date(patient.latestDate).toLocaleDateString('en-US', options)
            : "No Requests";
        });
        
        // limit to first 5 initially
        pageData = patientData.slice(0, 5);

        // chedck for Locks
        end = Math.ceil(patientData.length/5);
        start = end === 0 ? 0 : start;
        lockNext = start === end ? true : false;
        lockBack = start === 1 || start === 0 ? true : false;

        resp.render('view_patients', {
          layout: 'index',
          title: 'Laboratory Information System',
          pageData: pageData,
          start: start,
          end: end,
          lockNext: lockNext,
          lockBack: lockBack
        });
      });
  });

  server.post("/search-Patients", function(req, resp){
    let sort = req.body.sort;
    let pageData = new Array();
    let lockNext = false;
    let lockBack = false;
    let start = 1;
    let end;
    processPatients(req.body.search.trim(), patientModel, requestModel)
      .then(patientData => {

        // Sort Last Name
        if(sort === 'N'){
          let name = req.body.name;
          patientData.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if(name[name.length-1] === 'Z'){  //if A-Z change to Z-A
              if (nameA < nameB) {
                  return -1;
              }
              if (nameA > nameB) {
                  return 1;
              }
            }else{
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
        if(sort === 'D'){
          let date = req.body.date;
        patientData.sort((a, b) => {
          if (date[0] === 'R') {
            return b.latestDate - a.latestDate; // Newest to oldest
          } else {
            return a.latestDate - b.latestDate; // Oldest to newest
          }
        });
        }
        
        patientData.forEach(patient => {
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          
          const defaultDate = new Date(1960, 0, 1).getTime();

          patient.latestDate = (new Date(patient.latestDate).getTime() !== defaultDate)
            ? new Date(patient.latestDate).toLocaleDateString('en-US', options)
            : "No Requests";
        });
        
        // limit to first 5
        pageData = patientData.slice(0, 5);
        
        // chedck for Locks
        end = Math.ceil(patientData.length/5);
        start = end === 0 ? 0 : start;
        lockNext = start === end ? true : false;
        lockBack = start === 1 || start === 0 ? true : false;

        resp.json({
          pageData: pageData, 
          start: start,
          end: end,
          lockNext: lockNext,
          lockBack: lockBack
        });
      });

  });

  server.post("/sort-Patients", function(req, resp){
    let search = req.body.hasSearched === 'true' ? req.body.search.trim() : "";
    let pageData = new Array();
    let lockNext = false;
    let lockBack = false;
    let start = 1;
    let end;
    processPatients(search, patientModel, requestModel)
      .then(patientData => {
        
        let nameBtn_text = "";
        if(req.body.name){
          let name = req.body.name;
          nameBtn_text = name[name.length-1] !== 'Z' ? "Last Name A-Z" : "Last Name Z-A";
          patientData.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if(name[name.length-1] !== 'Z'){  //if A-Z change to Z-A
              if (nameA < nameB) {
                  return -1;
              }
              if (nameA > nameB) {
                  return 1;
              }
            }else{
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
        if(req.body.date){
          let date = req.body.date;
          dateBtn_text = date[0] !== 'R' ? "Recently Modified" : "Oldest Modified";
          patientData.sort((a, b) => {
            if (date[0] !== 'R') {
              return b.latestDate - a.latestDate; // Newest to oldest
            } else {
              return a.latestDate - b.latestDate; // Oldest to newest
            }
          });
        }
        
        patientData.forEach(patient => {
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          
          const defaultDate = new Date(1960, 0, 1).getTime();

          patient.latestDate = (new Date(patient.latestDate).getTime() !== defaultDate)
            ? new Date(patient.latestDate).toLocaleDateString('en-US', options)
            : "No Requests";
        });

        // limit to first 5
        pageData = patientData.slice(0, 5);
        
        // chedck for Locks
        end = Math.ceil(patientData.length/5);
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
          lockBack: lockBack
        });
    });
  });

  server.post("/move-Page", function(req, resp){
    let search = req.body.hasSearched === 'true' ? req.body.search.trim() : "";
    let pageDetails = req.body.pageNum.trim().split(" ");
    let sort = req.body.sort;
    let start = parseInt(pageDetails[0]);
    let end = pageDetails[3];

    processPatients(search, patientModel, requestModel)
      .then(patientData => {
        let pageData = new Array();

        // Sort Last Name
        if(sort === 'N'){
          let name = req.body.name;
          patientData.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if(name[name.length-1] === 'Z'){  //if A-Z change to Z-A
              if (nameA < nameB) {
                  return -1;
              }
              if (nameA > nameB) {
                  return 1;
              }
            }else{
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
        if(sort === 'D'){
          let date = req.body.date;
        patientData.sort((a, b) => {
          if (date[0] === 'R') {
            return b.latestDate - a.latestDate; // Newest to oldest
          } else {
            return a.latestDate - b.latestDate; // Oldest to newest
          }
        });
        }

        start += parseInt(req.body.move) ? 1 : -1;
        let lockNext = start === parseInt(end) ? true : false;
        let lockBack = start === 1 ? true : false;
        
        pageData = patientData.slice(start*5 - 5, start*5);

        patientData.forEach(patient => {
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          
          const defaultDate = new Date(1960, 0, 1).getTime();

          patient.latestDate = (new Date(patient.latestDate).getTime() !== defaultDate)
            ? new Date(patient.latestDate).toLocaleDateString('en-US', options)
            : "No Requests";
        });

        resp.json({
          pageData: pageData, 
          start: start, 
          end: end, 
          lockNext: lockNext, 
          lockBack: lockBack
        });
    });
  });
  });

  //adds to the database the user details upon registering
  server.post('/adduser-db', function (req, resp) {
    userModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] }).then(function (user) {
      if (user) {
        resp.redirect("/register");
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          let baseNo = 100;
          userModel.find({})
            .then(function (users) {
              var fullName = req.body.lname + ", " + req.body.fname + " " + req.body.mname;
              const userInstance = userModel({
                medtechID: baseNo + users.length,
                name: setDefault(fullName),
                username: setDefault(req.body.username),
                email: setDefault(req.body.email),
                sex: setDefault(req.body.sex),
                password: hash,
                prcno: setDefault(req.body.prc),
              });
              userInstance.save().then(function (user) {
                resp.redirect('/login'); //CHANGE THIS
              }).catch(errorFn);
              return;
            });
        });
      }
    });
  });

  server.post('/addpatient-db', function (req, resp) {

    let baseNo = 1000;
    patientModel.find({})
    .then(function(patients) {
    //add to the database patient details
    var actualName = req.body.lname + ", " + req.body.fname + " " + req.body.mname;
    const patientInstance = patientModel({
      patientID: baseNo + patients.length,
      name: setDefault(actualName),
      sex: setDefault(req.body.sex),
      birthday: setDefaultDate(req.body.bday),
      age: setDefaultNo(req.body.age),
      phoneNo: setDefault(req.body.pnum),
      email: setDefault(req.body.email),
      address: setDefault(req.body.address),
      remarks: ""
    });

    patientInstance.save().then(function (patient) {
      //add patient to db
      resp.redirect('/addpatient?=success');
    }).catch(errorFn);
  }).catch(errorFn);
  });


  //add request here
  server.get('/patient-request', function(req, resp) {
    patientModel.find().then(function(person) {
      let patient = new Array();
      for(const instance of person) {
        let nameParts = instance.name.split(',');
        let lastName = nameParts[0].trim();
        if (lastName.includes(' ')) {
          let lastNameParts = lastName.split(' ');
          lastName = lastNameParts.join('');
        }
        let firstName = nameParts[1].trim().split(' ');
        firstName.pop();
        if (firstName.length > 1) {
          firstName = firstName.join('');
        }
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
          address: instance.address
        });
        patient.sort((a, b) => {
          let lastNameComparison = a.lastname.localeCompare(b.lastname);
          if (lastNameComparison === 0) {
              return a.firstname.localeCompare(b.firstname);
          }
          return lastNameComparison;
      });
      }
      resp.render('patientrequest',{
        layout: 'index',
        title: 'Laboratory Information System - Patient Request',
        patient: patient,
        user: loggedUser.name
      });
    });
  });

  server.get('/add-patientrequest', function(req, resp) {
    let patientID = req.query.patientID;
    let medtechID = loggedUser.medtechID;
    let category = req.query.category;
    if(category == "ClinicalMicroscopy")
    {
      category = "Clinical Microscopy";
    }
    let status = 'Requested';
    let dateStart = new Date();
    let dateEnd = null;
    let remarks = "";

    const requestInstance = requestModel({
      patientID: patientID,
      medtechID: medtechID,
      category: category,
      status: status,
      dateStart: dateStart,
      dateEnd: dateEnd,
      remarks: remarks
    });
    requestInstance.save().then(function () {
      resp.redirect("/patient-request");
    });
  });

  
  server.post('/update-status-request-db', function(req, resp){
    const { requestID, status, startDate, finishDate, remarks } = req.body;

    requestModel.findOneAndUpdate(
        { requestID: requestID }, 
        { status: status, dateStart: startDate, dateEnd: finishDate, remarks: remarks }, 
        { new: true } // Return the updated document
    ).then(function(updatedRequest) {
        if (updatedRequest) {
            resp.status(200).json({ success: true, updatedRequest: updatedRequest });
        } else {
            resp.status(404).json({ success: false, message: "Request not found" });
        }
    }).catch(function(error) {
        console.error(error);
        resp.status(500).json({ success: false, message: "Error updating request" });
    });
  });

}

module.exports.add = add;

//?search={{searchWord}}&lowerdate={{lowDate}}&upperdate={{upDate}}&status={{requestStatus}}&category={{requestCategory}}&tests={{testName}}
