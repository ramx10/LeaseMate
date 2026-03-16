const jwt = require("jsonwebtoken");
const SECRET = "leasemate_secret"; // Matches authController.js

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

module.exports = { verifyToken };
