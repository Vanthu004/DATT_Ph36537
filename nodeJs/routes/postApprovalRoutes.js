const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/postApprovalController');

router.post('/', ctrl.createApproval);
router.get('/', ctrl.getAllApprovals);
router.get('/:id', ctrl.getApprovalById);
router.put('/:id', ctrl.updateApproval);
router.delete('/:id', ctrl.deleteApproval);

module.exports = router;
