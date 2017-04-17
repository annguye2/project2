// var mongoose = require('mongoose');
//
// var employeeSchema =  mongoose.Schema(
//  {
//    name: {  type: String, required: true   },
//    employeeId: { type: String, required: true, unique: true  },
//    tasks:   [{ name: String, chargeNumber : String , numHours: Number}],
//    availableHour: { type: Number, default: 176 },
//    phone: {  type: String },
//    isAvailable: { type: Boolean, default: false,  required: true},
//    email: { type: String }
// });
//  module.exports = mongoose.model ('Employee', employeeSchema);



 var Task = require('./task.js')
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 var employeeSchema =  mongoose.Schema(
  {
    _id: Number,
    name: {  type: String, required: true   },
    employeeId: { type: String, required: true, unique: true  },
    _tasks:   [{type: Schema.ObjectId, ref: 'Task' }],
    availableHour: { type: Number, default: 176 },
    phone: {  type: String },
    isAvailable: { type: Boolean, default: false,  required: true},
    email: { type: String }
 });
  module.exports = mongoose.model ('Employee', employeeSchema);
