const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  cccd: {
    type: String,
    required: [true, "CCCD là bắt buộc"],
    match: [/^\d{12}$/, "CCCD phải gồm đúng 12 chữ số"],
    trim: true
  },
  fullName: String,
  birthday: Date,
  gender: String,
  province: String,
  district: String,
  ward: String,
  job: String,
  ethnicity: String,
  phone: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

const Patient = mongoose.model("Patient", patientSchema, "patients");

module.exports = Patient;