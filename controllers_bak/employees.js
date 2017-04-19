var express = require('express');
var router = express.Router();
var Employees = require('../models/employee.js'); // employee schema
var Tasks = require('../models/task.js');
var employees = require('../data/employees.js'); // employees data

// server supporting methods
var removeEmployee = function (employees, employeeId){
  for (var i = 0; i < employees.length; i++) {
    console.log("employees[i].employeeId ", employees[i].employeeId , 'and passed in empIF: ', employeeId);
    if(employees[i].employeeId == employeeId){
      console.log("s]plice : ");
      employees.splice(i, 1);  //removes 1 element at position i
      break;
    }
  }
  console.log("employees.length: " , employees.length);
  return employees;
}
//---------------------------------
var getTaskedEmployees = function(allEmployees){
  var taskedEmployees = [];
  for (var i = 0; i < allEmployees.length; i++) {
         if( allEmployees[i].tasks.length != 0){
           taskedEmployees.push(allEmployees[i]);
         }
  }
  return taskedEmployees
}

//------- testing

// router.get('/json', (req, res)=>{
//   //res.send('found route')
//   // Employees.find({}, ( err, employees)=>{
//   //
//   //   if (err)
//   //   { res.send(err)
//   //   } else { res.send(employees)}
//   //
//   // });
// });

// router.get('/:id', (req, res)=>{
//   Employees.find({}, ( err, employees)=>{
//
//     if (err)
//     { res.send(err)
//     } else { res.send(employees)}
//
//   });
//
// });


//-----------------------------------------------Employee index page
router.get('/', function(req, res){
  Employees.find({}, function (err, allEmployees){
    res.render('./employees/index.ejs', {
      employees:allEmployees.sort(),
      taskedEmployees: getTaskedEmployees(allEmployees).sort()
    });
  });
});

//------------- show selected employee's information
router.get('/:id', function (req, res){
  Employees.findById({_id: req.params.id}, function(err, foundEmployee){
    //console.log('employee tasks: ' , foundEmployee._tasks);
       res.render('./employees/show.ejs', {
           employee :foundEmployee
       });
   });
});

//--------------------remove item from the tasked employees
//
router.delete('/:id', function(req, res){
  //  (hint: remove all task from selected employee)
  console.log('remove assigned employees');
  Employees.findById(req.params.id, function(err, foundEmployee){
    var tasks = foundEmployee.tasks;
    var employeeId = foundEmployee.employeeId;

    for (var i = 0; i < tasks.length; i++) {
      Tasks.findOne({name: tasks[i].name }, function (err, foundTasks){
        // console.log('Found?? ');
        var employees = foundTasks._employees;
        // console.log("emloyees: ", employees);
        var saveEmployees = removeEmployee(employees, employeeId)
        foundTasks._employees = saveEmployees;
        //foundTasks._employees = saveEmployees;
        foundTasks.save();
        //console.log("foundTasks:  ", foundTasks);
      })
    }

    foundEmployee.tasks =[];
    foundEmployee.save();
    res.redirect('/employees');

  });
});




module.exports = router;
