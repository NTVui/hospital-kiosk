const express = require('express')
const router = express.Router()

const controller = require("../../../../controllers/v1/admin/clinic-controller")

router.get('/', controller.index)

module.exports = router;