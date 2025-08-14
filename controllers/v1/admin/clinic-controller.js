const Clinic = require("../../../model/clinic-model");
const filterStatusHelper = require("../../../helpers/filterStatus");
const searchHelper = require("../../../helpers/search");
const paginationHelper = require("../../../helpers/pagination");
const systemConfig = require("../../../config/system");

// [GET] /admin/clinics
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  //Đoạn bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  //Sort
  //Quy ước: Khi FE truyền cho BE thì phải truyền thêm query nữa
  //?sortKey=tenPhongKham&sortValue=asc
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //End Sort

  //Pagination
  const countClinics = await Clinic.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 2,
    },
    req.query,
    countClinics
  );
  //End Pagination

  //Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.tenPhongKham = objectSearch.regex;
  }
  //End Search

  const clinics = await Clinic.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/clinics/index", {
    pageTitle: "Trang quản lí phòng khám",
    clinics: clinics,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
    currentUrl: req.originalUrl,
  });
};

// [GET] /admin/clinics/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const clinic = await Clinic.findOne(find);

    res.render("admin/pages/clinics/detail", {
      pageTitle: clinic.tenPhongKham, // [SỬA] Lấy tên phòng khám làm tiêu đề
      clinic: clinic,
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy phòng khám!");
    res.redirect(`${res.locals.pathAdmin}/clinics`);
  }
};

// [PATCH] /admin/clinics/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    await Clinic.updateOne(
      { _id: id },
      {
        status: status,
      }
    );
    req.flash("success", "Thành công!");
    const redirectUrl = req.get("Referer");
    res.redirect(redirectUrl);
  } catch (error) {
    console.log("LỖI KHI CẬP NHẬT TRẠNG THÁI:", error);
    req.flash("error", "Lỗi! Cập nhật trạng thái thất bại.");
    res.redirect(`${res.locals.pathAdmin}/clinics`);
  }
};

// [PATCH] /admin/clinics/change-multi/
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const idsString = req.body.ids;

  const ids = idsString
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  switch (type) {
    case "active":
      await Clinic.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
        }
      );
      req.flash("success", `Đã cập nhật ${ids.length} thành hoạt động!`);
      break;

    case "inactive":
      await Clinic.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
        }
      );
      req.flash("success", `Đã cập nhật ${ids.length} thành ngưng hoạt động!`);
      break;

    case "delete-all":
      await Clinic.deleteMany({ _id: { $in: ids } }, { deleted: true });
      req.flash("success", `Đã xóa hết!`);
      break;
    default:
      req.flash("error", "Hành động không hợp lệ!");
      break;
  }
  const redirectUrl = req.get("Referer");
  res.redirect(redirectUrl);
};

// [DELETE] /admin/clinics/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id.trim();

  //await Clinic.deleteOne({ _id: id }) Xóa hẳn
  //Xóa mềm: xóa trên nhưng trên database vẫn hiện nhưng thay đổi
  //deleted: true
  await Clinic.updateOne(
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

// [GET] /admin/clinics/create
module.exports.create = (req, res) => {
  res.render("admin/pages/clinics/create", {
    pageTitle: "Thêm mới phòng khám",
  });
};

// [POST] /admin/clinics/create
module.exports.createPost = async (req, res) => {
  try {
    // Sửa lại logic xử lý position
    if (req.body.position && req.body.position.trim() !== "") {
      req.body.position = parseInt(req.body.position);
    } else {
      // Nếu không nhập, tự động lấy số lượng + 1
      const count = await Clinic.countDocuments({ deleted: false });
      req.body.position = count + 1;
    }

    const newClinic = new Clinic(req.body);
    await newClinic.save();

    req.flash("success", "Tạo mới phòng khám thành công!");
    res.redirect(`${res.locals.pathAdmin}/clinics`);
  } catch (error) {
    console.error("LỖI KHI TẠO MỚI:", error); // Log lỗi chi tiết
    req.flash("error", "Tạo mới phòng khám thất bại!");
    res.redirect("back");
  }
};
//[GET] /admin/clinics/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const clinic = await Clinic.findOne({
      _id: id,
      deleted: false,
    });

    res.render("admin/pages/clinics/edit", {
      pageTitle: "Chỉnh sửa danh mục phòng khám",
      clinic: clinic,
    });
  } catch (error) {
    res.redirect(`${res.locals.pathAdmin}/clinics`);
  }
};

//[PATCH] /admin/clinics/edit/:id
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
    await Clinic.updateOne({ _id: id }, req.body);
    req.flash("success", "Chỉnh sửa thành công!");
  } catch (error) {
    console.error("LỖI KHI CẬP NHẬT:", error); // Log lỗi chi tiết
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`${res.locals.pathAdmin}/clinics`);
};
