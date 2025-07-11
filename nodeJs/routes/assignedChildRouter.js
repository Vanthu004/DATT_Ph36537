const express = require("express");
const router = express.Router();
const assignedChildController = require("../controllers/assignedChildController");
const authMiddleware = require("../middleware/authMiddleware");

// Gán trẻ cho tài khoản phụ
router.post("/assign", authMiddleware, assignedChildController.assignChildToUser);

// Hủy gán trẻ khỏi tài khoản phụ
router.post("/unassign", authMiddleware, assignedChildController.unassignChildFromUser);

// Lấy tất cả trẻ được gán cho một user
router.get("/by-user/:user_id", authMiddleware, assignedChildController.getChildrenByUser);

// Lấy tất cả tài khoản phụ được gán cho một trẻ
router.get("/by-child/:child_id", authMiddleware, assignedChildController.getUsersByChild);

// Lấy tất cả trẻ với thông tin gán cho tài khoản phụ cụ thể
router.get("/children-with-assignment/:user_id", authMiddleware, assignedChildController.getAllChildrenWithAssignment);

// Lấy tất cả trẻ đã gán cho parent_main
router.get("/all-assigned-for-parent", authMiddleware, assignedChildController.getAllAssignedChildrenForParent);

module.exports = router;
