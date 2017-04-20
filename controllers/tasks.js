var express = require('express');
var router = express.Router();
var Tasks = require('../models/task.js');
var Employees = require('../models/employee.js')
var employees = require('../data/employees.js');
var jobs = require('../data/jobs.js');

// server supporting methods
//--- remove task from each employee
var removeTask = function (tasks, chargeNumber){
  for (var i = 0; i < tasks.length; i++) {
    if(tasks[i].chargeNumber == chargeNumber){
      tasks.splice(i, 1);  //removes 1 element at position i
      break;
    }
  }
  console.log("task.length: " , tasks.length);
  return tasks;
}
//---------------------------------
var getAssignedTask = function(allTasks){
  var assignedTasks = [];
  for (var i = 0; i < allTasks.length; i++) {
         if( allTasks[i]._employees.length != 0){
           assignedTasks.push(allTasks[i]);
         }
  }
  return assignedTasks
}
//this method is used to defind if the obj is already in the list of objs
//-- find task
var findTask = function (tasks, task){
   for (var i = 0; i < tasks.length; i++) {
     console.log('task name :', tasks[i].name);
            if(tasks[i].name == task.name){
              return true;
            }
   }
   return false;
  }
  //------------ find employee
  var findEmployee = function (employees, employee){
     for (var i = 0; i < employees.length; i++) {
       console.log('employees name :', employees[i].name);
              if(employees[i].employeeId == employees.employeeId){
                return true;
              }
     }
     return false;
    }
//--------------------------------- create new Tasks


router.get('/create', function(req, res){
 console.log(req.body);
    res.render ( './tasks/create.ejs' );
});

router.post('/create', function(req, res){
  console.log(req.body);
  var job_data = {
    name: req.body.taskName,
    chargeNumber: req.body.chargeNumber,
    description: req.body.description,
    numHours: req.body.numberHours,
    numCompletedHours: 0,
    _employees:[],
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
})
  res.redirect('/tasks');
});
//----------------------------------show list of available task

router.get('/', function(req,res){
  Tasks.find({}, function(err, allTasks){
    Employees.find({}, function(err, allEmployees){
      res.render('./tasks/index.ejs',
      {
        tasks:allTasks.sort(),
        assignedTasks: getAssignedTask(allTasks),
        employees:allEmployees
      });
    });
  });
});

//----------------------------------sroute to add new task page

router.get('/:taskId/:empId/add', function(req, res){
  Tasks.findOne({_id: req.params.taskId }, function (err, foundTask){
    Employees.findOne({ _id: req.params.empId }, function(err, foundEmployee){
      res.render('./tasks/add.ejs',{
        task: foundTask,
        employee: foundEmployee
      });
    })
  });
});

router.post('/', function(req, res){
  Employees.findOne({employeeId: req.body.employeeId}, function(err, foundEmployee){
    Tasks.findOne({chargeNumber: req.body.chargeNumber} , function (err, foundTask){
      var task = {
          name: req.body.taskName,
          chargeNumber: req.body.chargeNumber,
          plannedHours: req.body.numberAssignedHour
      }
      //console.log("added Task : ", task );
      if(findTask(foundEmployee.tasks, task) == false){
        foundEmployee.tasks.push(task);
        foundEmployee.save();
        foundTask._employees.push(foundEmployee);
        foundTask.save();
      }else console.log('Task is already exit');
        res.redirect('/tasks');
    });
  });
});

//---------------------------------- Edit
// show assigned task, and show method of edit or delete
router.get('/:id/show', function(req, res){
  console.log('---------------');
  var hourObjs =[];
  Tasks.findById(req.params.id, function (err, foundTask){
   var _employees = foundTask._employees;
      for (var i = 0; i < _employees.length; i++) {
        console.log('employee name:', _employees[i].name);
        var tasks = _employees[i].tasks;
         for (var ii = 0; ii < tasks.length; ii++) {
             if (tasks[ii].chargeNumber == foundTask.chargeNumber){
               hourObjs.push({ chargeNumber: foundTask.chargeNumber,plannedHours: tasks[ii].plannedHours})
              //  console.log(tasks[ii].chargeNumber);
              //  console.log(tasks[ii].plannedHours);
             }
         }
      }

        res.render("./tasks/show.ejs", {
          task: foundTask,
          employees:_employees,
          plannedHoursObjs: hourObjs
        });
  });
});

//------------------------show selected task with list of employees
router.get('/:id', function(req,res){
  Tasks.findOne({ _id: req.params.id }, function(err, foundTask){
    Employees.find({}, function(err, allEmployees){
      res.render('./tasks/new.ejs',
      {
        employees: allEmployees,
        task:foundTask,
      });
    });
  });
});

//---------- delete task
router.delete('/:id', function(req, res){
  //  (hint: remove all task from selected employee)
  //console.log('remove task: ');
  Tasks.findById(req.params.id, function(err, foundTask){
    var saveEmployees = foundTask._employees
    var saveTaskChargeNumber = foundTask.chargeNumber;
    for (var i = 0; i < saveEmployees.length; i++) {
      //remove task in each employee's task list
      Employees.findOne({employeeId: saveEmployees[i].employeeId }, function (err, foundEmployee){
        var tasks = foundEmployee.tasks;
        var saveTasks = removeTask(tasks, saveTaskChargeNumber);
        foundEmployee.tasks = saveTasks;
        foundEmployee.save();
      })
    }
    //remove all employeee in removed task
    foundTask._employees =[];
    foundTask.save();
    res.redirect('/tasks');
  });
});


//------------------------------------------
module.exports = router;
