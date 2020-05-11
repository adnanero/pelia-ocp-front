
const express = require('express');
const router = express.Router();
const UplodController = require('./../controllers/UploadController')


router.post("/upload", UplodController.moveFile);


module.exports = router;