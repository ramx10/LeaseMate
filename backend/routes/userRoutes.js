const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/me", userController.getMyProfile);
router.get("/tenants/unassigned", userController.getUnassignedTenants);

module.exports = router;
