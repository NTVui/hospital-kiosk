const BHYT = require("../../../model/bhyt-record-model");
module.exports.index = async (req, res) => {
  try {
    const bhytRecords = await BHYT.find({
      // Thêm các điều kiện lọc nếu cần, ví dụ: deleted: false
    });

    res.render("admin/pages/bhyt/index", {
      pageTitle: "Quản lý BHYT",
      bhyt: bhytRecords // <--- THÊM DÒNG NÀY ĐỂ TRUYỀN DỮ LIỆU
    });
    
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu BHYT:", error);
    req.flash("error", "Không thể tải danh sách BHYT.");
    res.redirect("back");
  }
};