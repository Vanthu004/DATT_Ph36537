const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',            authMiddleware, userCtrl.createUser);  // Create - thêm authMiddleware
router.post('/sub-account', authMiddleware, userCtrl.createSubAccount); // Tạo tài khoản phụ
router.get('/',             authMiddleware, userCtrl.getAllUsers); // Read all
router.get('/me',           authMiddleware, userCtrl.getCurrentUser); // Get current user
router.get('/:id',          authMiddleware, userCtrl.getUserById); // Read one
router.put('/:id',          authMiddleware, userCtrl.updateUser);  // Update
router.delete('/:id',       authMiddleware, userCtrl.deleteUser);  // Delete
router.post('/login',  userCtrl.login);
router.post('/forgot-password', userCtrl.forgotPassword);
router.post('/reset-password', userCtrl.resetPassword);

module.exports = router;
