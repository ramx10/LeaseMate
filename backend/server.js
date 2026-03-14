const express = require("express");
const cors = require("cors");
const pool = require("./db");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const roomRoutes = require("./routes/roomRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* AUTH ROUTES */
app.use("/api/auth", authRoutes);

/* PROPERTY ROUTES */
app.use("/api/properties", propertyRoutes);

/* ROOM ROUTES */
app.use("/api/rooms", roomRoutes);

/* TENANTS ROUTES */
app.use("/api/tenants", tenantRoutes);

/* LEDGER ROUTES */
app.use("/api/ledger", ledgerRoutes);

/* DASHBOARD ROUTES */
app.use("/api/dashboard", dashboardRoutes);

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