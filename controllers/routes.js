//Routes


function add(server){
  const responder = require('../models/data');
  const { appdata } = require('../models/data');
  const patientModel = appdata.patientModel;

  function errorFn(err){
    console.log('Error found. Please trace!');
    console.error(err);
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
      name: actualName,
      sex: req.body.sex,
      birthday: req.body.bday,
      age: req.body.age,
      phoneNo: req.body.pnum,
      email: req.body.email,
      address: req.body.address
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
