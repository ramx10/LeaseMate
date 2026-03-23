const express = require("express");
const router = express.Router();
const tenantDashboardController = require("../controllers/tenantDashboardController");

router.get("/", tenantDashboardController.getTenantDashboardData);
router.get("/expense-analytics", tenantDashboardController.getTenantExpenseAnalytics);

module.exports = router;
