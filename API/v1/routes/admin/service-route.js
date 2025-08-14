const express = require('express')
const multer = require('multer')

const upload = multer()
const router = express.Router()

const controller = require("../../../../controllers/v1/admin/service-controller")
const uploadCloud = require("../../../../middleware/admin/uploadCloud-middlewares")

router.get('/', controller.index)
router.get('/detail/:id', controller.detail)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)
router.delete('/delete/:id', controller.deleteItem)
router.get('/create', controller.create)
router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.upload,
  controller.createPost,
)

router.get('/edit/:id', controller.edit)
router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  uploadCloud.upload,
  controller.editPatch,
)
module.exports = router;