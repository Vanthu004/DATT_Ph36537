const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/activityLogController');

router.post('/', ctrl.createLog);
router.get('/', ctrl.getAllLogs);
router.get('/:id', ctrl.getLogById);
router.put('/:id', ctrl.updateLog);
router.delete('/:id', ctrl.deleteLog);

module.exports = router;
