const express = require('express');
const router = express.Router();
const childCtrl = require('../controllers/childController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',        childCtrl.createChild);   // Tạo
router.get('/',         authMiddleware, childCtrl.getAllChildren); // Lấy tất cả
router.get('/:id',      childCtrl.getChildById);   // Lấy 1
router.put('/:id',      childCtrl.updateChild);    // Cập nhật
router.delete('/:id',   childCtrl.deleteChild);    // Xoá

module.exports = router;
