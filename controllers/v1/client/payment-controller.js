const Payment = require("../../../model/payment-model");
const Appointment = require("../../../model/appointment-model");

// Webhook confirm khi người dùng bấm nút Thanh toán
exports.confirm = async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);
  if (!payment) return res.status(404).send("Payment not found");

  // Update status
  payment.status = "success";
  await payment.save();

  // TODO: cập nhật appointment đã thanh toán

  // Gửi socket event về FE
  global._io.emit("payment-success", {
    paymentId,
    patientId: payment.patientId
  });

  res.json({ message: "Thanh toán thành công" });
};
