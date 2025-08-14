const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Tham chiếu đến model Patient
    required: true
  },
  clinic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic', // Tham chiếu đến model Clinic
    required: true
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Tham chiếu đến model Service
    required: true
  },
  soThuTu: { // Số thứ tự khám bệnh
    type: Number,
    required: true
  },
  maDangKy: { // Một mã duy nhất cho lượt đăng ký
    type: String,
    unique: true
  },
  maQR: { // Đường dẫn đến file ảnh QR code hoặc chuỗi mã hóa
    type: String
  },
  trangThai: { // Trạng thái của lượt khám
    type: String,
    enum: ['Chờ khám', 'Đang khám', 'Đã khám', 'Đã hủy'],
    default: 'Chờ khám'
  }
}, {
  timestamps: true // Tự động thêm createdAt (thời gian đăng ký) và updatedAt
});

const Registration = mongoose.model("Registration", registrationSchema, "registrations");

module.exports = Registration;