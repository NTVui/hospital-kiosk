const express = require('express');
const router = express.Router();
const controller = require("../../../../controllers/v1/client/kiosk-controller");

// Route cho trang chính
router.get('/', controller.index);
router.get('/step-1/dang-ky-kham-benh', controller.step1);

//Khám BHYT
router.get('/step-1/check-cccd', controller.step1checkCccd);
router.post('/step-1/check-cccd', controller.step1checkCccdPost);
router.get('/step-1/info', controller.step1Info);
router.post('/step-1/info', controller.step1InfoPost);
router.get('/step-2/register/:cccd', controller.step2Register);
router.post('/step-2/register/:cccd', controller.step2RegisterPost);

//Khám thu phí
router.get('/step-1/check-cccd-self', controller.step1checkCccdSelf);
router.post('/step-1/check-cccd-self', controller.step1checkCccdPostSelf);
router.post('/step-1/info-self', controller.step1InfoPostSelf);
router.get('/step-2/register-self/:cccd', controller.step2RegisterSelf);
router.post('/step-2/register-self/:cccd', controller.step2RegisterSelfPaid);


module.exports = router;