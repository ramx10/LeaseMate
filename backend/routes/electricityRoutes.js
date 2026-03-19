const express = require("express");
const router = express.Router();
const electricityController = require("../controllers/electricityController");

router.post("/add", electricityController.addBill);
router.get("/", electricityController.getBills);
router.delete("/:id", electricityController.deleteBill);

module.exports = router;
