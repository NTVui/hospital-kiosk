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
      limitItems: 2,
    },
    req.query,
    countClinics,
  )
  //End Pagination
  
  //Search
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.tenPhongKham = objectSearch.regex
  }
  //End Search

  const clinics = await Clinic.find(find)
  .sort(sort)
  .limit(objectPagination.limitItems)
  .skip(objectPagination.skip)
  
    res.render('admin/pages/clinics/index', {
    pageTitle: 'Trang quản lí phòng khám',
    clinics: clinics,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
    currentUrl: req.originalUrl 
  })
}

// [GET] /admin/clinics/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    }
    const clinic = await Clinic.findOne(find)
    
    
    res.render('admin/pages/clinics/detail', {
      pageTitle: product.title,
      clinic: clinic
    })
  } catch (error) {
    res.redirect(`${version}${systemConfig.prefixAdmin}/clinics`)
  }
}

// [PATCH] /admin/clinics/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    await Clinic.updateOne({
      _id: id
    },{
      status: status
    })
    req.flash('success', 'Thành công!')
    } catch (error) {
      console.log("LỖI KHI CẬP NHẬT TRẠNG THÁI:", error);
      req.flash('error', 'Lỗi! Cập nhật trạng thái thất bại.');
      res.redirect('back');
    }

}

// [PATCH] /admin/clinics/change-multi/
module.exports.changeMulti = async (req, res) => {
  
  const type = req.body.type;
  const idsString = req.body.ids;
   

  const ids = idsString
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  switch (type) {
    case 'active':
      await Clinic.updateMany({ _id: { $in: ids } }, {
        status: 'active' });
      req.flash('success', `Đã cập nhật ${ids.length} thành hoạt động!`)
      break; 

    case 'inactive':
      await Clinic.updateMany({ _id: { $in: ids } }, {
        status: 'inactive' });
      req.flash('success', `Đã cập nhật ${ids.length} thành ngưng hoạt động!`)
      break;
    
    case 'delete-all':
      await Clinic.deleteMany(
        { _id: {$in: ids}},
        {deleted: true}
      )
      req.flash('success', `Đã xóa hết!`)
      break;
    default:
      req.flash('error', 'Hành động không hợp lệ!');
      break;
  }
  const redirectUrl = req.body.redirect || `${pathAdmin}/clinics`;
  res.redirect(redirectUrl);
};
