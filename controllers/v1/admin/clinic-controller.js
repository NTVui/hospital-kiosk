const Clinic = require("../../../model/clinic-model");
const filterStatusHelper = require("../../../helpers/filterStatus");
const searchHelper = require("../../../helpers/search");
const paginationHelper = require("../../../helpers/pagination");

// [GET] /admin/clinics
module.exports.index = async (req,res) =>{
    
    const clinic = await Clinic.find({
      deleted: false
    })
    console.log(req.query.status)
    res.json(clinic)
  //   res.render('admin/pages/clinics/index', {
  //   pageTitle: 'Trang quản lí phòng khám',
    
  // })
}