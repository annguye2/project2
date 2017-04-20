var express = require('express');
var router = express.Router();
var Employees = require('../models/employee.js'); // employee schema
var Tasks = require('../models/task.js');
var employees = require('../data/employees.js'); // employees data

// server supporting methods
//------------------------------edit task
var editTasks = function (tasks, chargeNumber, plannedHours){

 for (var i = 0; i < tasks.length; i++) {
         if (tasks[i].chargeNumber == chargeNumber){
            tasks[i].plannedHours = plannedHours;
            break;
         }
 }
 return tasks
}
//------------------------------ get selected task
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
//----------------------------------------------create new Employee
router.get('/new', function(req, res){
   res.render('./employees/new.ejs');
});

router.post('/', function(req, res){
  console.log('---- addd employee');
  console.log(req.body);
  var employee_data = {
    name: req.body.name,
    employeeId: req.body.employeeId,
    tasks: [],
    availableHour: 168,
    phone: req.body.phone,
    email: req.body.email,
    isAvailable: false
  }
  var employee = new Employees(employee_data);
  employee.save( function(err, data){
    if(err){
      console.log(err);
    }
    else{
      console.log(data);
    }
  });
 res.redirect('/employees')
})
//-----------------------------------------------Employee index page
router.get('/', function(req, res){
  Employees.find({}, function (err, allEmployees){
    res.render('./employees/index.ejs', {
      employees:allEmployees.sort(),
      taskedEmployees: getTaskedEmployees(allEmployees).sort()
    });
  });
});

//------------------- edit Employe task infor (*hours*)
router.get('/:imployeeObjId/:taskChargeNumber/edit', function (req, res){
  Employees.findById({_id: req.params.imployeeObjId}, function(err, foundEmployee){
    Tasks.findOne({chargeNumber: req.params.taskChargeNumber}, function (err, foundTask){
      res.render('./employees/edit.ejs', {
        employee :foundEmployee,
        task: foundTask
      });
    });
  });
});

//------------------------------------------Edit task
router.put('/:id', function(req, res){
  console.log('------------ put--------');
  Employees.findOne({employeeId: req.body.employeeId}, function(err, foundEmployee){
    Tasks.findOne({chargeNumber: req.body.chargeNumber}, function (err, foundTask){
          var tasks = foundEmployee.tasks; //save the tasks
          foundEmployee.tasks =[];
          foundEmployee.tasks = editTasks(tasks, req.body.chargeNumber, req.body.plannedHours);
          foundEmployee.save();
      for (var i = 0 ; i < foundTask._employees.length ; i ++){
            //find employee
              if (foundTask._employees[i].employeeId == req.body.employeeId){
                 console.log(foundTask._employees[i]);
                 foundTask._employees[i].tasks = [];
                 foundTask._employees[i].tasks =foundEmployee.tasks
                break;
              }
        }
        foundTask.save();
    });
    res.redirect('/employees')
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

//--------------------remove item from the tasked employees
//
router.delete('/delete/:id', function(req, res){

  //  (hint: remove all task from selected employee)
  console.log('remove employees in mongoose');

  Employees.findByIdAndRemove(req.params.id, function(err, foundEmployee){
    console.log('found employee', foundEmployee);
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
//------------- show selected employee's information
router.get('/:id', function (req, res){
  Employees.findById({_id: req.params.id}, function(err, foundEmployee){
    //console.log('employee tasks: ' , foundEmployee._tasks);
       res.render('./employees/show.ejs', {
           employee :foundEmployee
       });
   });
});


module.exports = router;
