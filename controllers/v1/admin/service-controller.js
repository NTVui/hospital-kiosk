const Service = require("../../../model/service-model");
const Clinic = require("../../../model/clinic-model");
const filterStatusHelper = require("../../../helpers/filterStatus");
const searchHelper = require("../../../helpers/search");
const paginationHelper = require("../../../helpers/pagination");
const systemConfig = require('../../../config/system')


// [GET] /admin/services
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
  const countServices = await Service.countDocuments(find)
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 2,
    },
    req.query,
    countServices,
  )
  //End Pagination
  
  //Search
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.tenDichVu = objectSearch.regex
  }
  //End Search

  const services = await Service.find(find)
  .sort(sort)
  .limit(objectPagination.limitItems)
  .skip(objectPagination.skip)
  
    res.render('admin/pages/services/index', {
    pageTitle: 'Trang quản lí dịch vụ',
    services: services,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
    currentUrl: req.originalUrl 
  })
}

// [GET] /admin/services/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    //ở service model nếu muốn lấy ten6PhongKham ở Clinic và hiện dịch vụ này thuộc khoa nào
    //thêm ref: 'Clinic' trong clinic_id
    const service = await Service.findOne(find).populate('clinic_id');;

    res.render('admin/pages/services/detail', {
      pageTitle: service.tenDichVu, 
      service: service
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy dịch vụ!");
    res.redirect(`${res.locals.pathAdmin}/services`);
  }
}

// [PATCH] /admin/services/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    await Service.updateOne({ _id: id }, {
    status: status,
   
    })
    req.flash('success', 'Thành công!')
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl);
    } catch (error) {
      console.log("LỖI KHI CẬP NHẬT TRẠNG THÁI:", error);
      req.flash('error', 'Lỗi! Cập nhật trạng thái thất bại.');
      res.redirect(`${res.locals.pathAdmin}/services`);
    }
    
}

// [PATCH] /admin/services/change-multi/
module.exports.changeMulti = async (req, res) => {
  
  const type = req.body.type;
  const idsString = req.body.ids;
   

  const ids = idsString
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  switch (type) {
    case 'active':
      await Service.updateMany({ _id: { $in: ids } }, {
        status: 'active' });
      req.flash('success', `Đã cập nhật ${ids.length} thành hoạt động!`)
      break; 

    case 'inactive':
      await Service.updateMany({ _id: { $in: ids } }, {
        status: 'inactive' });
      req.flash('success', `Đã cập nhật ${ids.length} thành ngưng hoạt động!`)
      break;
    
    case 'delete-all':
      await Service.deleteMany(
        { _id: {$in: ids}},
        {deleted: true}
      )
      req.flash('success', `Đã xóa hết!`)
      break;
    default:
      req.flash('error', 'Hành động không hợp lệ!');
      break;
  }
  const redirectUrl = req.get('Referer')
  res.redirect(redirectUrl);
};

// [GET] /admin/services/create
module.exports.create = async (req, res) => {
  try {
    // Lấy tất cả các phòng khám đang hoạt động
    const clinics = await Clinic.find({
      deleted: false,
      status: "Hoạt động"
    }).select("id tenPhongKham"); // Chỉ lấy id và tên để tối ưu

    res.render('admin/pages/services/create', {
      pageTitle: 'Thêm mới Dịch vụ',
      clinics: clinics // <-- Truyền danh sách phòng khám vào Pug
    });

  } catch (error) {
    req.flash("error", "Không thể tải trang, vui lòng thử lại.");
    res.redirect(`${res.locals.pathAdmin}/services`);
  }
};

// [POST] /admin/services/create
module.exports.createPost = async (req, res) => {
  try {
    // Logic xử lý position của bạn đã đúng
    if (req.body.position && req.body.position.trim() !== "") {
      req.body.position = parseInt(req.body.position);
    } else {
      const count = await Service.countDocuments({ deleted: false });
      req.body.position = count + 1;
    }
    
    
    console.log(req.body); // Bạn có thể log ra để kiểm tra

    const newService = new Service(req.body);
    await newService.save();

    req.flash("success", "Tạo mới dịch vụ thành công!");
    res.redirect(`${res.locals.pathAdmin}/services`);
  } catch (error) {
    console.error("LỖI KHI TẠO DỊCH VỤ:", error); // Log lỗi chi tiết
    req.flash("error", "Tạo mới dịch vụ thất bại!");
    res.redirect("back");
  }
};

// [DELETE] /admin/services/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id.trim();

  
  await Service.updateOne(
    { _id: id },
    {
      deleted: true,
      //deleteAt: new Date(),
      // deletedBy:{
      //   account_id: res.locals.user.id,
      //   deletedAt: new Date()
      // }
    }
  );

  const redirectUrl = req.get("Referer");
  res.redirect(redirectUrl);
};
// [GET] /admin/services/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Lấy thông tin dịch vụ cần sửa
    const service = await Service.findOne({
      _id: id,
      deleted: false,
    });

    // 2. Lấy tất cả các phòng khám để cho người dùng chọn
    const clinics = await Clinic.find({ deleted: false });

    // 3. Render ra đúng file view của services và truyền tất cả dữ liệu vào
    res.render("admin/pages/services/edit", {
      pageTitle: "Chỉnh sửa dịch vụ",
      service: service, // <-- Truyền dịch vụ cần sửa
      clinics: clinics  // <-- Truyền danh sách phòng khám
    });

  } catch (error) {
    req.flash("error", "Không tìm thấy dịch vụ!");
    res.redirect(`${res.locals.pathAdmin}/services`);
  }
};

//[PATCH] /admin/services/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  // Sửa lại logic xử lý position
  if (req.body.position && req.body.position.trim() !== "") {
    req.body.position = parseInt(req.body.position);
  } else {
    // Nếu người dùng xóa trắng ô position, ta loại bỏ nó khỏi object cập nhật
    // để Mongoose không cố gắng lưu giá trị rỗng/NaN
    delete req.body.position;
  }

  // Xử lý việc upload/xóa ảnh
  // Nếu người dùng upload file mới, middleware uploadCloud đã thêm req.body.thumbnail
  // Nếu người dùng bấm "Xóa ảnh", client sẽ gửi lên clearThumbnail = "true"
  if (req.body.clearThumbnail === "true") {
    req.body.thumbnail = "";
  }
  delete req.body.clearThumbnail;

  try {
    await Service.updateOne({ _id: id }, req.body);
    req.flash("success", "Chỉnh sửa thành công!");
  } catch (error) {
    console.error("LỖI KHI CẬP NHẬT:", error); 
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`${res.locals.pathAdmin}/services`);
};
