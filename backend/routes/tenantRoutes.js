const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");

router.post("/add", tenantController.addTenant);
router.get("/", tenantController.getTenants);
router.delete("/:id", tenantController.deleteTenant);

module.exports = router;