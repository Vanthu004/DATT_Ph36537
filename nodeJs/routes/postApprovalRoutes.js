const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/postApprovalController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', ctrl.createApproval);
router.get('/', ctrl.getAllApprovals);
router.get('/:id', ctrl.getApprovalById);
router.put('/:id', authMiddleware, ctrl.updateApproval);
router.delete('/:id', ctrl.deleteApproval);

module.exports = router;
