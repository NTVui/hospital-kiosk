
const kioskRoutes = require("./kiosk-route")
const paymentkRoutes = require("./payment-route")

module.exports = (app) => {
    const version = "/API/v1";

    app.use(version + "/kiosk", kioskRoutes);
    app.use("/api/payment", paymentkRoutes);
};