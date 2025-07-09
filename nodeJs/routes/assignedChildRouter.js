const express = require("express");
const router = express.Router();
const assignedChildController = require("../controllers/assignedChildController");

// Gán trẻ cho tài khoản phụ
router.post("/assign", assignedChildController.assignChildToUser);

// Hủy gán trẻ khỏi tài khoản phụ
router.post("/unassign", assignedChildController.unassignChildFromUser);

// Lấy tất cả trẻ được gán cho một user
router.get("/by-user/:user_id", assignedChildController.getChildrenByUser);

// Lấy tất cả tài khoản phụ được gán cho một trẻ
router.get("/by-child/:child_id", assignedChildController.getUsersByChild);

module.exports = router;
