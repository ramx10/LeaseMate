const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");

router.post("/add", ledgerController.addLedger);
router.post("/generate", ledgerController.generateMonthlyLedger);
router.get("/", ledgerController.getLedger);
router.put("/paid/:id", ledgerController.markPaid);

module.exports = router;