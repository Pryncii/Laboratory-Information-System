//Routes


function add(server){
  const responder = require('../models/data');
  const { appdata } = require('../models/data');
  const userModel = appdata.userModel;
  const patientModel = appdata.patientModel;

  function errorFn(err){
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


  server.get('/', function(req, resp){
    resp.render('login',{
      layout: 'index',
      title: 'Laboratory Information System - Login'
    });
  });
  
  server.get('/main', function(req, resp){
    resp.render('main',{
      layout: 'index',
      title: 'Laboratory Information System - Main'
    });
  });
  server.get('/register', function(req, resp){
    resp.render('register', {
      layout: 'index',
      title: 'Laboratory Information System - Register'
    });
  });
  
  server.get('/addpatient', function(req, resp){
    resp.render('addpatient',{
      layout: 'index',
      title: 'Laboratory Information System - Add Patient'
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

    userInstance.save().then(function(user){
      resp.redirect('/'); //CHANGE THIS
    }).catch(errorFn);
  });

  server.post('/addpatient-db', function(req, resp){

    //add to the database patient details
    var actualName = req.body.lname + ", " + req.body.fname + " " + req.body.mname;
    const patientInstance = patientModel({
      name: setDefault(actualName),
      sex: setDefault(req.body.sex),
      birthday: setDefaultDate(req.body.bday),
      age: setDefaultNo(req.body.age),
      phoneNo: setDefault(req.body.pnum),
      email: setDefault(req.body.email),
      address: setDefault(req.body.address)
    });

    patientInstance.save().then(function(patient) {
      //add patient to db
      resp.redirect('/');
    }).catch(errorFn);
  });
  
}

module.exports.add = add;

//Note: There are other ways to declare routes. Another way is to
//      use a structure called router. It would look like this:
//      const router = express.Router()
