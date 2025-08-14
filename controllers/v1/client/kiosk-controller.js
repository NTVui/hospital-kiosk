const BHYT = require("../../../model/bhyt-record-model");
const Patient = require("../../../model/patient-model");

// [GET] /kiosk
module.exports.index = (req, res) => {
  // Thay vì render layout mặc định, hãy chỉ định layout cho KIOSK
  res.render("client/pages/kiosk/index", { 
    pageTitle: "Chào mừng" 
  });
};

module.exports.step1 = (req, res) => {
  res.render("client/pages/kiosk/step-1", {
    pageTitle: "Bước 1: Thông tin",
    
  });
};
// [POST] /kiosk/step1/check-cccd
module.exports.checkCccd = async (req, res) => {
  try {
    const { cccd } = req.body;

    // 1. Kiểm tra BHYT
    const bhytRecord = await BHYT.findOne({ cccd: cccd });
    if (!bhytRecord) {
      return res.json({
        success: true, // Request thành công nhưng...
        hasBhyt: false, // ...không có BHYT
        message: "CCCD không có đăng ký BHYT hợp lệ."
      });
    }

    // 2. Nếu có BHYT, kiểm tra xem bệnh nhân đã có trong hệ thống chưa
    const patient = await Patient.findOne({ cccd: cccd});
    if (patient) {
      // Nếu đã có thông tin
      return res.json({
        success: true,
        hasBhyt: true,
        patientExists: true,
        patientInfo: patient
      });
    } else {
      // Nếu chưa có thông tin
      return res.json({
        success: true,
        hasBhyt: true,
        patientExists: false
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại." });
  }
};

// Hàm render Step 2
module.exports.step2 = (req, res) => {
  res.render("client/pages/kiosk/step-2", {
    pageTitle: "Bước 2: Chọn dịch vụ",
    step: 2 // <-- THÊM BIẾN NÀY
  });
};

// Hàm render Step 3
module.exports.step3 = (req, res) => {
  res.render("client/pages/kiosk/step-3", {
    pageTitle: "Bước 3: Hoàn tất",
    step: 3 // <-- THÊM BIẾN NÀY
  });
};