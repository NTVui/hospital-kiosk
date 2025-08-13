module.exports.dashboard = async (req,res) => {
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        
    });
}