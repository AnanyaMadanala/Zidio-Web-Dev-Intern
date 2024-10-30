// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  certificateID: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  domain: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model('Student', studentSchema);
