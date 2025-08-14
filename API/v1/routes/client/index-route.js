
const kioskRoutes = require("./kiosk-route")


module.exports = (app) => {
    const version = "/API/v1";

    app.use(version + "/kiosk", kioskRoutes);

};