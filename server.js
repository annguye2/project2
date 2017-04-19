var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

// connect to heroku
var mongoDBURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/herokutest'
var port = process.env.PORT || 3000;




var Tasks = require('./models/task.js')
var Employees = require('./models/employee.js');

var jobs = require('./data/jobs.js');
var employees = require('./data/employees.js');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:false}));
app.use( express.static( 'public' ) );
var db = mongoose.connection;
db.on('error', function(){
	console.log('error');
});


// loading data into monogodb
var loadData = function (){
  db.once('open', function(){
    for (var i = 0; i < employees.length; i++) {
      var employee_data = {
        name: employees[i].name,
        employeeId: employees[i].empId,
        tasks: [],
        availableHour: 168,
        phone: employees[i].phone,
        email: employees[i].email,
				isAvailable: false
      }
      var employee = new Employees(employee_data);
      employee.save( function(err, data){
        if(err){
          //console.log(err);
        }
        else{
          console.log(data);
        }
      });
    }
    for (var i = 0; i < jobs.length; i++) {
      var job_data = {
        name: jobs[i].name,
        chargeNumber: jobs[i].chargeNumber,
        description: jobs[i].description,
        numHours: jobs[i].hours,
        numCompletedHours: 0,
        employees:[],
        date: Date()
      }
      var task = new Tasks (job_data);
      task.save( function(err, data){
        if(err){
          console.log('task error', err);
        }
        else{
          console.log(data);
        }
      });
    }
  }); // end of open connections
  db.close();
}

loadData();

var employeesController = require('./controllers/employees.js');
app.use('/employees', employeesController);

var tasksController = require('./controllers/tasks.js');
app.use('/tasks', tasksController);
//
app.get('/', function(req, res){

    res.render('index.ejs', {
        tasks:jobs,
        employees
    });
});


mongoose.connect(mongoDBURL);

app.listen(port, function(){
    console.log('Server is listening...');
});
//------------------------testing section --------------//



//---- end of testing section
