const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

router.post("/add", propertyController.addProperty);
router.get("/", propertyController.getProperties);
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;