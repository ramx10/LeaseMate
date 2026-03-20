const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/rent-due", notificationController.getNotifications);

module.exports = router;
