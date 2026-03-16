const express = require("express");
const router = express.Router();
const tenantDashboardController = require("../controllers/tenantDashboardController");

// Basic auth middleware placeholder. 
// Ideally we should move this to a reusable middleware file, but for now we'll implement it inline to avoid breaking existing code.
const jwt = require("jsonwebtoken");
const SECRET = "leasemate_secret";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json("No token provided");
  
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json("No token provided");

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json("Unauthorized");
    req.user = decoded; // Contains id and role
    next();
  });
};

router.get("/", verifyToken, tenantDashboardController.getTenantDashboardData);

module.exports = router;
