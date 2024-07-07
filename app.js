
const express = require('express');
const server = express();

const bodyParser = require('body-parser')
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

//This part of the code will load the controllers that will interact
//with the rest of the system.
const controllers = [
  'add_patient_route',
  'login_register_route',
  'main_route',
  'patient_request_route',
  'view_patients_route',
  'patient_history_route'
];

controllers.forEach(controller => {
  const model = require('./controllers/' + controller);
  model.add(server);
});

server.get("/", function (req, resp) {
  resp.redirect("/login");
}); 

const port = process.env.PORT | 9090;
server.listen(port, function(){
  console.log('Listening at port '+port);
});
