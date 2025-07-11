const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reminderController');

router.post('/', ctrl.createReminder);
router.get('/', ctrl.getAllReminders);
router.get('/by-child/:child_id', ctrl.getRemindersByChild);
router.get('/child/:child_id', ctrl.getRemindersByChild); // Thêm route này để tương thích frontend
router.get('/:id', ctrl.getReminderById);
router.put('/:id', ctrl.updateReminder);
router.delete('/:id', ctrl.deleteReminder);

module.exports = router;
