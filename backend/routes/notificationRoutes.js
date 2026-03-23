const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/rent-due", notificationController.getNotifications);
router.put("/mark-read/:id", notificationController.markAsRead);
router.post("/clear-all", notificationController.clearAll);

module.exports = router;
