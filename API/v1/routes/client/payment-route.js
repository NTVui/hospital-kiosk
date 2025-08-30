const express = require('express');
const router = express.Router();
const controller = require("../../../../controllers/v1/client/payment-controller");

router.post("/confirm/:paymentId", controller.confirm);

module.exports = router;