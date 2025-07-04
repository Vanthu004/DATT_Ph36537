const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.post('/',            userCtrl.createUser);  // Create
router.get('/',             userCtrl.getAllUsers); // Read all
router.get('/:id',          userCtrl.getUserById); // Read one
router.put('/:id',          userCtrl.updateUser);  // Update
router.delete('/:id',       userCtrl.deleteUser);  // Delete
router.post('/login',  userCtrl.login);
router.post('/forgot-password', userCtrl.forgotPassword);
router.post('/reset-password', userCtrl.resetPassword);

module.exports = router;
