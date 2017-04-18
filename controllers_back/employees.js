var express = require('express');
var router = express.Router();
var Employees = require('../models/employee.js') // employee schema
var employees = require('../data/employees.js'); // employees data

var getEmployeeInfo = function (empId){
   for (var i = 0; i < employees.length; i++) {
     if ( employees[i].empId == empId) {return employees[i];}
   }
}


router.get('/', function(req, res){
  Employees.find({}, function (err, allEmployees){
    res.render('./employees/index.ejs', {
      employees:allEmployees
    });
  });
});

//------------- show selected employee's information
router.get('/:id', function (req, res){
  Employees.findById(req.params.id, function(err, foundEmployee){

    console.log('employee tasks: ' , foundEmployee._tasks);
       res.render('./employees/show.ejs', {
           employee :foundEmployee
       });
   });
});

















module.exports = router;
