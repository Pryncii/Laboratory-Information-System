//Routes


function add(server){
  const responder = require('../models/data');
  const { appdata } = require('../models/data');
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
    resp.render('main',{
      layout: 'index',
      title: 'Laboratory Information System'
    });
  });

  server.get('/addpatient', function(req, resp){
    resp.render('addpatient',{
      layout: 'index',
      title: 'Laboratory Information System'
    });
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
