const systemConfig = require("../../../../config/system");
const dashboardRoutes = require("./dashboard-route")
const clinicRoutes = require("./clinic-route")
const serviceRoutes = require("./service-route")
const bhytRoutes = require("./bhyt-route")
const pathMiddleware = require("../../../../middleware/admin/path-middleware");

module.exports = (app) => {
  const version = "/API/v1";
  const PATH_ADMIN = `${version}${systemConfig.prefixAdmin}`

  app.use(PATH_ADMIN, pathMiddleware.path);
  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_ADMIN + "/clinics", clinicRoutes);
  app.use(PATH_ADMIN + "/services", serviceRoutes);
  app.use(PATH_ADMIN + "/bhyt", bhytRoutes);
};
