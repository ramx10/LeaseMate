const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issueController");

router.post("/report", issueController.reportIssue);
router.get("/", issueController.getIssues);
router.put("/:id", issueController.updateIssueStatus);

module.exports = router;
