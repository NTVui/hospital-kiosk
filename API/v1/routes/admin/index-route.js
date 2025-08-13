const systemConfig = require("../../../../config/system");
const dashboardRoutes = require("./dashboard-route")
module.exports = (app) => {
  const version = "/API/v1";
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(version + PATH_ADMIN + "/dashboard", dashboardRoutes);
  //app.get(version + PATH_ADMIN, );
};
