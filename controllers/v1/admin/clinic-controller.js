const Clinic = require("../../../model/clinic-model");
const filterStatusHelper = require("../../../helpers/filterStatus");
const searchHelper = require("../../../helpers/search");
const paginationHelper = require("../../../helpers/pagination");

// [GET] /admin/clinics
module.exports.index = async (req,res) =>{
    
  let find = {
    deleted: false,
  }

  if (req.query.status) {
    find.status = req.query.status
  }
  //Đoạn bộ lọc
  const filterStatus = filterStatusHelper(req.query)

  const clinic = await Clinic.find(find)
  res.json(clinic)
  //   res.render('admin/pages/clinics/index', {
  //   pageTitle: 'Trang quản lí phòng khám',
    
  // })
}