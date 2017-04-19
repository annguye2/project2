var mongoose = require('mongoose');

var employeeSchema =  mongoose.Schema(
 {
   name: {  type: String, required: true   },
   employeeId: { type: String, required: true, unique: true  },
   tasks:   [{ name: String, chargeNumber : String , plannedHours: Number}],
   availableHour: { type: Number, default: 176 },
   phone: {  type: String },
   isAvailable: { type: Boolean, default: false,  required: true},
   email: { type: String }
});
 module.exports = mongoose.model ('Employee', employeeSchema);
