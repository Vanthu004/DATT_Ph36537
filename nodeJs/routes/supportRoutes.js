const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/supportController');

router.post('/', ctrl.createTicket);
router.get('/', ctrl.getAllTickets);
router.get('/:id', ctrl.getTicketById);
router.put('/:id/resolve', ctrl.resolveTicket);
router.delete('/:id', ctrl.deleteTicket);

module.exports = router;
