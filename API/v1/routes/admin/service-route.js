const express = require('express')
const router = express.Router()

const controller = require("../../../../controllers/v1/admin/service-controller")

router.get('/', controller.index)
router.get('/detail/:id', controller.detail)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)

module.exports = router;