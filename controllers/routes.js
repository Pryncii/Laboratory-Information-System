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
                patientData: patientData
              });
          });
        })
      .catch(errorFn);
  });

  server.post("/sort-Patients", function(req, resp){
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
                if (date[0] === 'R') {
                  return a.latestDate - b.latestDate; // Oldest to newest
                } else {
                  return b.latestDate - a.latestDate; // Newest to oldest
                }
              });
            }
            
            patientData.forEach(patient => {
              const options = { month: 'long', day: 'numeric', year: 'numeric' };
              patient.latestDate = patient.latestDate.toLocaleDateString('en-US', options);
            });
            
            //check
            console.log(patientData);
            resp.json({patientData: patientData, nameBtn_text: nameBtn_text, dateBtn_text});
        });
      })
    .catch(errorFn);
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
