var express = require('express');
var router = express.Router();
var Tasks = require('../models/task.js');
var Employees = require('../models/employee.js')
var employees = require('../data/employees.js');
var jobs = require('../data/jobs.js');

//----------------------------------show list of available task

router.get('/', function(req,res){
  Tasks.find({}, function(err, allTasks){
    Employees.find({}, function(err, allEmployees){
      res.render('./tasks/index.ejs',
      {
        tasks:allTasks,
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
//---------------------------------- Add task and post back to tasks page
router.post('/', function(req, res){
  console.log('----------------------------');
  console.log('req.body', req.body);
  var distintArray = [];
Employees.findOne({employeeId: req.body.employeeId}, function(err, foundEmployee){
  Tasks.findOne({chargeNumber: req.body.chargeNumber}, function (err, foundTask){

    console.log("foundTask._id", foundTask._id);
    console.log("foundEmployee._tasks:  ", foundEmployee._tasks);
    if(!foundEmployee._tasks.includes(foundTask._id)){
      console.log('not includes');
        foundEmployee._tasks.push(foundTask);
        foundEmployee.save();
    }else{ alert('the object is already in the list' )}



    foundTask._employees.push(foundEmployee);
    foundTask.save();
    res.redirect('/tasks');
    });
  });
});

//---------------------------------- Edit
// show assigned task, and show method of edit or delete
router.get('/:id/edit', function(req, res){
  res.send("show/edit")
})

//------------------------show selected task with list of employees
router.get('/:id', function(req,res){
  Tasks.findOne({  _id: req.params.id }, function(err, foundTask){
    Employees.find({}, function(err, allEmployees){
      console.log('found task', foundTask);
      res.render('./tasks/new.ejs',
      {
        employees: allEmployees,
        task:foundTask,
      });
    });
  });
});

module.exports = router;
