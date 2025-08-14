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
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.tenPhongKham = objectSearch.regex
  }
  //Search

  //End Search
  const clinic = await Clinic.find(find)
  .sort(sort)
  .limit(objectPagination.limitItems)
  .skip(objectPagination.skip)
  res.json(clinic)
  //   res.render('admin/pages/clinics/index', {
  //   pageTitle: 'Trang quản lí phòng khám',
    
  // })
}

// [GET] /admin/clinics/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    }
    const clinic = await Clinic.findOne(find)
    
    res.json(clinic)
    // res.render('admin/pages/products/detail', {
    //   pageTitle: product.title,
    //   product: product,
    // })
  } catch (error) {
    //res.redirect(`${version}${systemConfig.prefixAdmin}/clinics`)
  }
}

// [GET] /admin/clinics/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await Clinic.updateOne({
      _id: id
    },{
      status: status
    })
    
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công"
    })
    } catch (error) {
      res.json({
      code: 400,
      message: "Không tồn tại"
    })
    }

}

// [PATCH] /admin/clinics/change-multi/
/*
{
  "type": "status",
  "ids": "id_1,id_2,id_3",
  "value": "Hoạt động"
}
*/
module.exports.changeMulti = async (req, res) => {
  
  const type = req.body.type;
  const idsString = req.body.ids;
  const value = req.body.value; 

  const ids = idsString
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  switch (type) {
    case 'status':
      await Clinic.updateMany({ _id: { $in: ids } }, {
        status: value 
      });
      res.json({
        code: 200,
        message: "Cập nhật trạng thái thành công"
      });
      break; 

    case 'delete': // Ví dụ cho trường hợp khác
      // ...
      break;
      
    default:
      res.json({
        code: 400,
        message: "Hành động không hợp lệ"
      });
      break;
  }
};
