
//This schema servers as a task that include   all task's attributes, also includes a set of employees who join that task

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var Employee = require('./employee.js')
//
// var taskSchema = mongoose.Schema({
// name: { type: String, required: true, unique: true  }, // task name
// chargeNumber: {  type: String, required: true, unique: true }, // charge number for the task
// numHours:  {  type: Number, required: true, min: [0, 'must be greater than 0'] }, // num hours given for the task
// numCompletedHours: {  type: Number, required: true }, // number hours already spent on the task
// employees:   [Employee.schema], // set of employees who perform the task
// description: {  type: String  },
// date:  { type: Date }
// });
//
//
// module.exports  = mongoose.model('Task', taskSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Employee = require('./employee.js')

var taskSchema = mongoose.Schema({
name: { type: String, required: true, unique: true  }, // task name
chargeNumber: {  type: String, required: true, unique: true }, // charge number for the task
numHours:  {  type: Number, required: true, min: [0, 'must be greater than 0'] }, // num hours given for the task
numCompletedHours: {  type: Number, required: true }, // number hours already spent on the task
_employees:   [{ type: Number, ref: 'Employee' }], // set of employees who perform the task
description: {  type: String  },
date:  { type: Date }
});


module.exports  = mongoose.model('Task', taskSchema);
