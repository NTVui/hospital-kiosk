

// ⚡ kết nối socket.io
var socket = io();

// ⚡ lấy paymentId được embed từ pug qua attribute
const paymentId = document.body.dataset.paymentId;
const patientId = document.body.dataset.patientId;
const statusDiv = document.getElementById("status");

socket.once("payment-success", (data) => {
  if (data.paymentId === paymentId) {
    statusDiv.innerText = "✅ Thanh toán thành công! Chuẩn bị chuyển tiếp...";

    let count = 5;
    const timer = setInterval(() => {
      statusDiv.innerText = `✅ Thanh toán thành công! Đang chuyển tiếp sau ${count--} giây...`;
      if (count < 0) {
        clearInterval(timer);
        window.location.href = `/kiosk/step-4/print-ticket/${patientId}`;
      }
    }, 1000);
  }
});
