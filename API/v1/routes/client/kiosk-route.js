const express = require('express');
const router = express.Router();
const controller = require("../../../../controllers/v1/client/kiosk-controller");

// Route cho trang chính
router.get('/', controller.index);
router.get('/step-1/check-cccd', controller.step1);
router.post('/step-1/check-cccd', controller.checkCccd);

// router.get('/step-2', controller.step2);
// router.get('/step-3', controller.step3);

module.exports = router;