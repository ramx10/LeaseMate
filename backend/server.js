const express = require("express");
const cors = require("cors");
const pool = require("./db");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* AUTH ROUTES */
app.use("/api/auth", authRoutes);

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