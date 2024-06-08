//Routes
const bcrypt = require("bcrypt");
const { query } = require("express");
const { Int32 } = require("mongodb");
const saltRounds = 10;
var loggedUser;

function add(server) {
  const responder = require('../models/data');
  const { appdata } = require('../models/data');
  const userModel = appdata.userModel;
  const patientModel = appdata.patientModel;
  const requestModel = appdata.requestModel;
  const hematologyModel = appdata.hematologyModel;
  const urinalysisModel = appdata.urinalysisModel;
  const fecalysisModel = appdata.fecalysisModel;
  const chemistryModel = appdata.chemistryModel;
  const serologyModel = appdata.serologyModel;
  // Use this model to look for the corresponding test
  // Note: Can't query specific values of tests, use other
  // Models to query a specific category
  const allTestModel = appdata.allTestModel;

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
    resp.redirect('/login');
  });

  server.get('/login', function (req, resp) {
    resp.render('login', {
      layout: 'index',
      title: 'Login - Laboratory Information System'
    });
  });

  server.get('/main/:pageNo', async function (req, resp) {
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

    if(req.query.search !== undefined || req.query.search !== "")
    {
      regex = new RegExp(req.query.search, 'i');
      
      const patients = await patientModel.find({ name: regex } );
        for (const item of patients) {
          //console.log(item.patientID);
          //console.log(item.name);
          listofID.push(item.patientID);
        }

        searchQuery.$and.push({
          $or: [
              { category: regex },
              { status: regex },
              { remarks: regex },
              { patientID: { $in: listofID} }
          ]
        });
    }

    if ((req.query.lowerdate !== undefined && isValidDate(req.query.lowerdate)) || (req.query.upperdate !== undefined && isValidDate(req.query.upperdate))) {
        const dateRangeQuery = {};

        if (req.query.lowerdate !== undefined && isValidDate(req.query.lowerdate)) {
          const lowerDate = new Date(req.query.lowerdate);
          dateRangeQuery['$gte'] = lowerDate;
          //console.log("LowerDate " + lowerDate);
        }
  
        if (req.query.upperdate !== undefined && isValidDate(req.query.upperdate)) {
          const upperDate = new Date(req.query.upperdate);
          dateRangeQuery['$lte'] = upperDate;
          //console.log("UpperDate " + upperDate);
        }
  
        // Add date range criteria
        searchQuery.$and.push({
          $or: [
            { dateStart: dateRangeQuery },
            { dateEnd: dateRangeQuery }
          ]
        });
    }

    

    // Check if category is defined and non-empty
    if (req.query.category !== 'AA' && req.query.category !== undefined) {
      // Add category query to the search query
      searchQuery.$and.push({ category: req.query.category });
    }

    // Check if category is defined and non-empty
    if (req.query.status !== 'A' && req.query.status !== undefined) {
      // Add category query to the search query
      searchQuery.$and.push({ status: req.query.status });
    }

    console.log("Search Query");
    console.log(searchQuery);

    if (searchQuery.$and.length === 0) {
      searchQuery = {};
    }

    requestModel.find(searchQuery)
  .then(async function(requests) {
    requests = requests.reverse();
    
    console.log("requests");
    console.log(requests);

    console.log('List successful');
    let vals = [];
    let valNo = req.params.pageNo - 1;
    let counts = 0;
    let subval = [];
    let statusColor;
    let patientNo = 1;
    let flagStatus = "";

    for (const item of requests) {
      try {
        const patients = await patientModel.findOne({patientID: item.patientID});
        const medtechs = await userModel.findOne({medtechID: item.medtechID});
        //Check the value of each test in chemistry and add a flag if out of range
        if(item.category == "Chemistry"){
          const tests = await chemistryModel.findOne({requestID: item.requestID});
          if (tests && tests.fbs != null) {
            if (tests.fbs < 75.0) {
                flagStatus = "LOW";
            } else if (tests.fbs > 115.0) {
                flagStatus = "HIGH";
            }
          }
          
          if (tests && tests.rbs != null) {
              if (tests.rbs > 140) {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.creatinine != null) {
              if (tests.creatinine < 0.7 && patients.sex === "M") {
                  flagStatus = "LOW";
              } else if (tests.creatinine > 1.4 && patients.sex === "M") {
                  flagStatus = "HIGH";
              } else if (tests.creatinine < 0.6 && patients.sex === "F") {
                  flagStatus = "LOW";
              } else if (tests.creatinine > 1.1 && patients.sex === "F") {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.uricAcid != null) {
              if (tests.uricAcid < 2.5) {
                  flagStatus = "LOW";
              } else if (tests.uricAcid > 7.0) {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.cholesterol != null) {
              if (tests.cholesterol > 200) {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.triglycerides != null) {
              if (tests.triglycerides > 150) {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.hdl != null) {
              if (tests.hdl < 30) {
                  flagStatus = "LOW";
              } else if (tests.hdl > 70 && patients.sex === "M") {
                  flagStatus = "LOW";
              } else if (tests.hdl > 85 && patients.sex === "F") {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.ldl != null) {
              if (tests.ldl > 130) {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.vldl != null) {
              if (tests.vldl < 8) {
                  flagStatus = "LOW";
              } else if (tests.vldl > 33) {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.bun != null) {
              if (tests.bun < 1.7) {
                  flagStatus = "LOW";
              } else if (tests.bun > 8.3) {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.sgpt != null) {
              if (tests.sgpt > 40 && patients.sex === "M") {
                  flagStatus = "HIGH";
              } else if (tests.sgpt > 31 && patients.sex === "F") {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.sgot != null) {
              if (tests.sgot > 37 && patients.sex === "M") {
                  flagStatus = "HIGH";
              } else if (tests.sgot > 31 && patients.sex === "F") {
                  flagStatus = "HIGH";
              }
          }
          
          if (tests && tests.hba1c != null) {
              if (tests.hba1c < 4.5) {
                  flagStatus = "LOW";
              } else if (tests.hba1c > 6.5) {
                  flagStatus = "HIGH";
              }
          }
        }
      

        if(item.status == "Completed"){
          statusColor = "c";
        } else if (item.status == "In Progress"){
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
          status: item.status,
          dateStart: item.dateStart ? item.dateStart.toLocaleString('en-US', { timeZone: 'UTC' }): '',
          dateEnd: item.dateEnd ? item.dateEnd.toLocaleString('en-US', {timeZone: 'UTC'}) : '',
          remarks: item.remarks,
          barColor: statusColor,
          flag: flagStatus
        });
        
        counts += 1;
        patientNo += 1;
        if (counts === 5) {
          counts = 0;
          patientNo = 1;
          vals.push(subval);
          subval = [];
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    let pageFront;
    let pageBack;
    if(subval.length > 0){
      vals.push(subval);
    }
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

    let finalQuery;
    let querySearch = [];

    if(req.query.search) {
      querySearch.push("search=" + req.query.search);
    }

    if(req.query.lowerDate) {
      querySearch.push("lowerDate=" + req.query.lowerDate);
    }

    if(req.query.upperDate) {
      querySearch.push("upperDate=" + req.query.upperDate);
    }

    if(req.query.status) {
      querySearch.push("status=" + req.query.status);
    }

    if(req.query.category) {
      querySearch.push("category=" + req.query.category);
    }

    if(req.query.tests) {
      querySearch.push("tests=" + req.query.tests);
    }

    if (querySearch.length > 0){
      finalQuery = "?";
      finalQuery += querySearch.join("&");
    } else {
      finalQuery = "";
    }
    
    resp.render('main', {
      layout: 'index',
      title: 'Main - Laboratory Information System',
      data: vals[valNo],
      pageFirst: req.params.pageNo == 1,
      pageLast: req.params.pageNo == vals.length,
      pageNo: req.params.pageNo,
      pageNoNext: pageFront,
      pageNoBack: pageBack,
      pageNoCap: vals.length,
      user: loggedUser.name,
      query: finalQuery
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
          lockBack: lockBack,
          user: loggedUser.name
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
    let start = parseInt(pageDetails[1]);
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
    let baseNumber = 1000;
    if(category == "ClinicalMicroscopy")
    {
      category = "Clinical Microscopy";
    }
    let status = 'Requested';
    let dateStart = new Date();
    let dateEnd = null;
    let remarks = "";

    requestModel.find({})
    .then(function(requests) {
    const requestInstance = requestModel({
      requestID: baseNumber + requests.length,
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
  });

  
  server.post('/update-status-request-db', function(req, resp){
    const { requestID, status, remarks } = req.body;
    let dateEnd;
    let date = new Date();
    let utc_8 = date.getTime() + (date.getTimezoneOffset() * 60000);
    let pstoffset = 8 * 60 * 60 * 1000;
    let pst = new Date(utc_8 + pstoffset);

    if(status === "Completed")
      dateEnd = pst;
    
    const updateValues = {
      $set:
      {
        status: status,
        dateEnd: dateEnd,
        remarks: remarks
      }
    }
      
    requestModel.updateOne({ requestID: requestID }, updateValues)
    .then(async function(updatedRequest) {
      if (updatedRequest) {
        // If the update was successful, redirect back to the main page
        resp.redirect('/main/1');
    } else {
        // If the request was not found, respond with a 404 error
        resp.status(404).json({ success: false, message: "Request not found" });
    }
    })
    .catch(function(error) {
        console.error(error);
        resp.status(500).json({ success: false, message: "Error updating request" });
    });
});

}



module.exports.add = add;

//?search={{searchWord}}&lowerdate={{lowDate}}&upperdate={{upDate}}&status={{requestStatus}}&category={{requestCategory}}&tests={{testName}}
