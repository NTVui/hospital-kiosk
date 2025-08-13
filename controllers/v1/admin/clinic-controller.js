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

  //Sort
  //Quy ước: Khi FE truyền cho BE thì phải truyền thêm query nữa
  //?sortKey=tenPhongKham&sortValue=asc
  let sort = {}
  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue
  }else{
    sort.position = "desc"
  }
  //End Sort

  //Pagination
  const countClinics = await Clinic.countDocuments(find)
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countClinics,
  )
  //End Pagination

  const clinic = await Clinic.find(find)
  .sort(sort)
  .limit(objectPagination.limitItems)
  .skip(objectPagination.skip)
  res.json(clinic)
  //   res.render('admin/pages/clinics/index', {
  //   pageTitle: 'Trang quản lí phòng khám',
    
  // })
}