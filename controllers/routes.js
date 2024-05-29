//Routes
const bcrypt = require("bcrypt");
const saltRounds = 10;

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


  server.get('/', function (req, resp) {
    resp.redirect("/login");
  });

  server.get('/login', function (req, resp) {
    resp.render('login', {
      layout: 'index',
      title: 'Login - Laboratory Information System'
    });
  });

  server.get('/main', function (req, resp) {
    resp.render('main', {
      layout: 'index',
      title: 'Main - Laboratory Information System'
    });
  });

  server.get('/register', function (req, resp) {
    resp.render('register', {
      layout: 'index',
      title: 'Register - Laboratory Information System'
    });
  });

  server.get('/main', function (req, resp) {
    resp.render('main', {
      layout: 'index',
      title: 'Main - Laboratory Information System'
    });
  });
  
  server.get('/addpatient', function(req, resp){
    resp.render('addpatient',{

      layout: 'index',
      title: 'Add Patient - Laboratory Information System'
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
            .find({ patient: patient.patientID })
            .lean()
            .then(requests => {
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
  
        // Return a promise that resolves when all patient data is processed
        return Promise.all(promises);
      });
  };

  server.get('/viewpatients', function(req, resp){
    let pageData = new Array();
    let lockNext = false;
    let lockBack = false;
    let start = 1;
    let end;
    processPatients("", patientModel, requestModel)
      .then(patientData => {
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
        
        // Format dates
        patientData.forEach(patient => {
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          patient.latestDate = patient.latestDate.toLocaleDateString('en-US', options);
        });
        
        // limit to first 5 initially
        pageData = patientData.slice(0, 5);

        // chedck for Locks
        end = Math.ceil(patientData.length/5);
        lockNext = start === end ? true : false;
        lockBack = start === 1 ? true : false;

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
    processPatients(req.body.search, patientModel, requestModel)
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
          patient.latestDate = patient.latestDate.toLocaleDateString('en-US', options);
        });
        
        // limit to first 5
        pageData = patientData.slice(0, 5);
        
        // chedck for Locks
        end = Math.ceil(patientData.length/5);
        lockNext = start === end ? true : false;
        lockBack = start === 1 ? true : false;

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
    let search = req.body.hasSearched === 'true' ? req.body.search : "";
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
          patient.latestDate = patient.latestDate.toLocaleDateString('en-US', options);
        });

        // limit to first 5
        pageData = patientData.slice(0, 5);
        
        // chedck for Locks
        end = Math.ceil(patientData.length/5);
        lockNext = start === end ? true : false;
        lockBack = start === 1 ? true : false;
        
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
    let search = req.body.hasSearched === 'true' ? req.body.search : "";
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
          patient.latestDate = patient.latestDate.toLocaleDateString('en-US', options);
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


  //adds to the database the user details upon registering
  server.post('/adduser-db', function(req, resp){
    var fullName = req.body.lastname + ", " + req.body.firstname;
    const userInstance = userModel({
      name: setDefault(fullName),
      username: setDefault(req.body.username),
      email: setDefault(req.body.email),
      sex: setDefault(req.body.sex),
      password: setDefault(req.body.password),
      prcno: setDefault(req.body.prc),
    });
  });

  server.post("/login-validation", function (req, resp) { // tbd
    resp.redirect("/main");
  });

  //adds to the database the user details upon registering
  server.post('/adduser-db', function (req, resp) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      var fullName = req.body.lastname + ", " + req.body.firstname + req.body.middlename;
      const userInstance = userModel({
        name: setDefault(fullName),
        username: setDefault(req.body.username),
        email: setDefault(req.body.email),
        sex: setDefault(req.body.sex),
        password: setDefault(req.body.password),
        prcno: setDefault(req.body.prc),
      });
      userInstance.save().then(function (user) {
        resp.redirect('/login'); //CHANGE THIS
      }).catch(errorFn);
      return;
    });
  });

  server.post('/addpatient-db', function (req, resp) {

    //add to the database patient details
    var actualName = req.body.lname + ", " + req.body.fname + " " + req.body.mname;
    const patientInstance = patientModel({
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
      resp.redirect('/');
    }).catch(errorFn);
  });

  //add request here

}

module.exports.add = add;

//Note: There are other ways to declare routes. Another way is to
//      use a structure called router. It would look like this:
//      const router = express.Router()
