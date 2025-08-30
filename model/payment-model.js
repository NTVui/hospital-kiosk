const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["cash", "qr"], required: true },
  transactionId: { type: String }, // ID để gắn với QR code
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
