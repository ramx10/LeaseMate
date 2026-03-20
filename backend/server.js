const express = require("express");
const cors = require("cors");
const pool = require("./db");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const roomRoutes = require("./routes/roomRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const tenantDashboardRoutes = require("./routes/tenantDashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const issueRoutes = require("./routes/issueRoutes");
const { verifyToken } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

/* AUTH ROUTES */
app.use("/api/auth", authRoutes);

/* PROPERTY ROUTES */
app.use("/api/properties", verifyToken, propertyRoutes);

/* ROOM ROUTES */
app.use("/api/rooms", verifyToken, roomRoutes);

/* TENANTS ROUTES */
app.use("/api/tenants", verifyToken, tenantRoutes);

/* LEDGER ROUTES */
app.use("/api/ledger", verifyToken, ledgerRoutes);

/* DASHBOARD ROUTES */
app.use("/api/dashboard", verifyToken, dashboardRoutes);

/* TENANT DASHBOARD ROUTES */
app.use("/api/tenant-dashboard", verifyToken, tenantDashboardRoutes);

/* USER ROUTES */
app.use("/api/users", verifyToken, userRoutes);

/* NOTIFICATION ROUTES */
app.use("/api/notifications", verifyToken, notificationRoutes);

/* ISSUES ROUTES */
app.use("/api/issues", verifyToken, issueRoutes);

/* HOME ROUTE */
app.get("/", (req, res) => {
  res.send("LeaseMate Backend Running");
});

/* DATABASE TEST ROUTE */
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection error");
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});