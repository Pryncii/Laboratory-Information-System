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
  // Initialize an empty search query object
    let searchQuery = {};

    // Check if lowerprice and/or upperprice are defined and non-empty
    if (req.query.lowerdate !== '' || req.query.upperdate !== '') {
        // Construct the price range query
        searchQuery.date = {};
        if (req.query.lowerprice !== '') {
            searchQuery.date.$gte = req.query.lowerdate;
        }
        if (req.query.upperprice !== '') {
            searchQuery.date.$lte = req.query.upperdate;
        }
    }

    // Check if category is defined and non-empty
    if (req.query.category !== '') {
        // Add category query to the search query
        searchQuery.category = req.query.category;
    }
    requestModel.find({})
  .then(async function(requests) {
    console.log('List successful');
    let vals = [];
    let counts = 0;
    let subval = [];
    let statusColor;

    for (const item of requests) {
      try {
        const patients = await patientModel.findById(item.patient);
        const medtechs = await userModel.findById(item.medtech);

        if(item.status == "Completed"){
          statusColor = "c";
        } else if (item.status == "In Progress"){
          statusColor = "ip";
        } else {
          statusColor = "";
        }

        subval.push({
          patientID: patients.patientID,
          patientName: patients.name,
          medtech: medtechs.name,
          category: item.category,
          status: item.status,
          dateStart: item.dateStart.toLocaleString('en-US', { timeZone: 'UTC' }),
          dateEnd: item.dateEnd ? item.dateEnd.toLocaleString('en-US', {timeZone: 'UTC'}) : '',
          remarks: item.remarks,
          barColor: statusColor
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

    vals.push(subval);
    console.log(vals);
    resp.render('main', {
      layout: 'index',
      title: 'Main - Laboratory Information System',
      data: vals[0] 
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

  server.get('/addpatient', function (req, resp) {
    resp.render('addpatient', {
      layout: 'index',
      title: 'Add Patient - Laboratory Information System'
    });
  });

  server.post("/login-validation", function (req, resp) { // tbd
    resp.redirect("/main");
  });

  //adds to the database the user details upon registering
  server.post('/adduser-db', function (req, resp) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      var fullName = req.body.lastname + ", " + req.body.firstname + " " + req.body.middlename;
      const userInstance = userModel({
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
