//Routes


function add(server){
  const responder = require('../models/data');
  const { appdata } = require('../models/data');
  const patientModel = appdata.patientModel;

  server.get('/', function(req, resp){
    resp.render('addpatient',{
      layout: 'index',
      title: 'Laboratory Information System'
    });
  });
  
}

module.exports.add = add;

//Note: There are other ways to declare routes. Another way is to
//      use a structure called router. It would look like this:
//      const router = express.Router()
