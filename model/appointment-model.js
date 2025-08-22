const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true
  },
  serviceName: { type: String, required: true },  
  clinicName: { type: String, required: true },    
  doctorName: {
    type: String,
    default: "Đang cập nhật"
  },
  queueNumber: {
    type: Number,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["waiting", "in-progress", "done", "cancelled"],
    default: "waiting"
  }
}, {
  timestamps: true // tự động có createdAt, updatedAt
});

module.exports = mongoose.model("Appointment", appointmentSchema);
