const BHYT = require("../../../model/bhyt-record-model");
const Patient = require("../../../model/patient-model");
const Service = require("../../../model/service-model")
const Clinic = require("../../../model/clinic-model")
const Appointment = require("../../../model/appointment-model")
const axios = require('axios');
// [GET] /kiosk
module.exports.index = (req, res) => {
  // Thay vì render layout mặc định, hãy chỉ định layout cho KIOSK
  res.render("client/pages/kiosk/index", { 
    pageTitle: "Chào mừng" 
  });
};

// [GET] /kiosk/step-1/dang-ky-kham-benh
module.exports.step1 = (req, res) => {
  res.render("client/pages/kiosk/step-1", {
    pageTitle: "Chọn đối tượng khám bệnh",
    currentStep: 1
  });
};


// [GET] /kiosk/step-1/check-cccd
module.exports.step1checkCccd = (req, res) => {
  res.render("client/pages/kiosk/step-1-cccd", {
    pageTitle: "Kiểm tra CCCD, BHYT",
    currentStep: 1
  });
};
//[POST] /kiosk/step-1/check-cccd
module.exports.step1checkCccdPost = async (req, res) => {
  try {
    const { cccd, soBHYT } = req.body;

    if (!/^\d{12}$/.test(cccd)) {
      req.flash("error", "CCCD phải gồm đúng 12 chữ số");
      return res.redirect("/API/v1/kiosk/step-1/check-cccd");
    }

    let bhytRecord
    if (soBHYT) {
      bhytRecord = await BHYT.findOne({ cccd, soBHYT });
    } else {
      bhytRecord = await BHYT.findOne({ cccd });
    }
    if (!bhytRecord) {
      req.flash('error', 'Không tìm thấy thẻ BHYT. Vui lòng chuyển sang khám dịch vụ.');
      return res.redirect('/API/v1/kiosk/step-1/dang-ky-kham-benh');
    }


    if (!bhytRecord.hospitalCode.startsWith("BV")) {
      req.flash('error', 'Thẻ BHYT khác tuyến. Vui lòng chuyển sang đăng ký khám dịch vụ.');
      return res.redirect('/API/v1/kiosk/step-1/dang-ky-kham-benh');
    }


    const patient = await Patient.findOne({ cccd, deleted: false });

    if (patient) {
      return res.redirect(`/API/v1/kiosk/step-1/info?cccd=${cccd}`);
    } else {
      req.flash("error", "Vui lòng nhập thông tin vì chưa có!")
      return res.redirect(`/API/v1/kiosk/step-1/info?cccd=${cccd}&new=1`);

    }

  } catch (error) {
    console.error(error);
    req.flash('error', ' Lỗi hệ thống. Vui lòng thử lại.');
    return res.redirect("back");
  }
};

// [GET] /kiosk/step-1/info
module.exports.step1Info = async (req, res) => {
  try {
    const { cccd, new: isNew } = req.query;

    if (!cccd) {
      req.flash('error', 'Thiếu CCCD để tra cứu thông tin.');
      return res.redirect('/API/v1/kiosk/step-1/check-cccd');
    }

    // Lấy danh sách provinces cho form
    const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
    const provinces = response.data || [];

    if (isNew === "1") {
      return res.render("client/pages/kiosk/patient-form", {
        pageTitle: "Nhập thông tin bệnh nhân",
        currentStep: 2,
        cccd,
        provinces
      });
    }

    const patient = await Patient.findOne({ cccd, deleted: false });

    if (!patient) {
      req.flash('error', 'Không tìm thấy thông tin bệnh nhân.');
      return res.redirect('/API/v1/kiosk/step-1/check-cccd');
    }
    if(patient){
      req.flash("success", "Đã có thông tin bệnh nhân!")
    }
    res.render("client/pages/kiosk/patient-info", {
      pageTitle: "Thông tin bệnh nhân",
      currentStep: 2,
      patient,
      provinces
    });

  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi hệ thống.');
    return res.redirect('/API/v1/kiosk/step-1/check-cccd');
  }
};



// //[POST] /kiosk/step-1/info
// module.exports.step1InfoPost = async (req, res) => {
//   console.log(req.body)
// };

// [POST] /kiosk/step-1/info
module.exports.step1InfoPost = async (req, res) => {
  //console.log(req.body)
  try {
    const CccdExist = await Patient.findOne({ 
    cccd: req.body.cccd,
    deleted: false });
  if(CccdExist){
    req.flash('error', 'CCCD đã tồn tại')
    const redirectUrl = req.get('Referer')
    return res.redirect(redirectUrl)
  }
  const patient = new Patient({
      ...req.body,
      province: req.body.provinceName,
      district: req.body.districtName,
      ward: req.body.wardName
    });
  await patient.save();
  req.flash("success", "Thêm mới thành công!");
  return res.redirect(`/API/v1/kiosk/step-1/info?cccd=${req.body.cccd}`);
  } catch (error) {
    console.log(error)
    req.flash("error", "Lỗi hệ thống khi lưu thông tin bệnh nhân.");
  }
  // try {
  //   const { cccd, fullName, birthday, gender, province, district, ward, job, ethnicity, phone } = req.body;

  //   // Kiểm tra bệnh nhân đã có trong DB chưa
  //   let patient = await Patient.findOne({ cccd, deleted: false });

  //   if (patient) {
  //     // 🔄 Nếu có → update thông tin
  //     patient.fullName = fullName;
  //     patient.birthday = birthday;
  //     patient.gender = gender;
  //     patient.province = province;
  //     patient.district = district;
  //     patient.ward = ward;
  //     patient.job = job;
  //     patient.ethnicity = ethnicity;
  //     patient.phone = phone;

  //     await patient.save();
  //     req.flash("success", "Cập nhật thông tin bệnh nhân thành công!");
  //   } else {
  //     // Nếu chưa có → tạo mới
  //     patient = new Patient({
  //       cccd,
  //       fullName,
  //       birthday,
  //       gender,
  //       province,
  //       district,
  //       ward,
  //       job,
  //       ethnicity,
  //       phone
  //     });

  //     await patient.save();
  //     req.flash("success", "Thêm mới bệnh nhân thành công!");
  //   }

  //   // Sau khi lưu → chuyển sang trang hiển thị info
  //   return res.redirect(`/API/v1/kiosk/step-1/info?cccd=${cccd}`);

  // } catch (error) {
  //   console.error(error);
  //   req.flash("error", "Lỗi hệ thống khi lưu thông tin bệnh nhân.");
  //   const redirectUrl = req.get("Referer");
  //   return res.redirect(redirectUrl);
  // }
};

// [GET] /kiosk/step-2/services/:cccd
module.exports.step2Register = async (req, res) => {
  try {
    const cccd = req.params.cccd
    const services = await Service.find({ status: "active", deleted: false });
    const clinics = await Clinic.find({ status: "active", deleted: false });
    res.render("client/pages/kiosk/register",{
      pageTitle: "Chọn dịch vụ khám",
      currentStep: 2,
      services: services,
      clinics: clinics,
      cccd
    })
    // res.json({
    //   success: true,
    //   services,
    //   clinics
    // });
  } catch (err) {
    console.error("Error listServices:", err);
    //res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// [POST] /kiosk/step-2/services/:cccd
module.exports.step2RegisterPost = async (req, res) => {
  try {
    const { cccd } = req.params;
    const { serviceId, clinicId } = req.body;

    const patient = await Patient.findOne({ cccd });
    if (!patient) return res.status(404).send("Bệnh nhân không tồn tại");

    // Check nếu bệnh nhân đã có appointment trong ngày
    const today = new Date();
    const startOfDay = new Date(today.setHours(0,0,0,0));

    let appointment = await Appointment.findOne({
      patientId: patient._id,
      clinicId,
      serviceId,
      createdAt: { $gte: startOfDay }
    });

    // Nếu chưa có thì tạo mới
    if (!appointment) {
      const count = await Appointment.countDocuments({
        clinicId,
        createdAt: { $gte: startOfDay }
      });
      const queueNumber = count + 1;

      const clinic = await Clinic.findById(clinicId);
      const service = await Service.findById(serviceId);

      const doctorName = clinic?.bacSiPhuTrach || "Đang cập nhật";
      const qrCode = `APPT-${Date.now()}-${queueNumber}`;

      appointment = new Appointment({
        patientId: patient._id,
        serviceId,
        clinicId,
        doctorName,
        queueNumber,
        qrCode
      });
      await appointment.save();
    }

    // Render ra pug
    res.render("client/pages/kiosk/appointment-success", {
      pageTitle: "Đăng ký thành công",
      appointment,
      patient
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};



// [GET] /kiosk/step-3
// module.exports.step3 = (req, res) => {
//   res.render("client/pages/kiosk/step-3", {
//     pageTitle: "Bước 3: Hoàn tất",
//     currentStep: 3
//   });
// };