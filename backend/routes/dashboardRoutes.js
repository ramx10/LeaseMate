const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/", dashboardController.getDashboard);
router.get("/rent-analytics", dashboardController.getRentAnalytics);
router.get("/payment-analytics", dashboardController.getPaymentAnalytics);

module.exports = router;