const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  cccd: {
    type: String,
    required: [true, "Số CCCD là bắt buộc"],
    unique: true,
    trim: true
  },
  hoTen: {
    type: String,
    required: [true, "Họ tên là bắt buộc"],
    trim: true
  },
  ngaySinh: {
    type: Date,
    required: [true, "Ngày sinh là bắt buộc"]
  },
  gioiTinh: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    required: [true, "Giới tính là bắt buộc"]
  },
  soDienThoai: {
    type: String,
    trim: true
  },
  diaChi: { 
    type: String,
    trim: true
  },
  ngheNghiep: {
    type: String,
    trim: true
  },
  danToc: {
    type: String,
    trim: true
  },
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