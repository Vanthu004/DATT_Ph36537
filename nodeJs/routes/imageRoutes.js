const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');

// Cấu hình multer để lưu file tạm
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload image
router.post('/upload', upload.single('image'), imageController.uploadImage);
// Delete image
router.post('/delete', imageController.deleteImage);

module.exports = router; 