const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "leasemate_secret";

/* GET ALL PROPERTIES (PUBLIC - for registration dropdown) */
exports.getPublicProperties = async (req, res) => {
  try {
    const properties = await pool.query(
      "SELECT id, property_name FROM properties ORDER BY property_name ASC"
    );
    res.json(properties.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching properties");
  }
};

/* REGISTER */
exports.register = async (req, res) => {
  try {

    if (!req.body) {
      return res.status(400).json("Request body missing");
    }

    const { name, email, password, role, property_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json("All fields are required");
    }

    // If role is Tenant, property_id is required
    if (role === "Tenant" && !property_id) {
      return res.status(400).json("Please select a building/property");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      "INSERT INTO users (name,email,password,role,property_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, email, hashedPassword, role, role === "Tenant" ? property_id : null]
    );

    res.json(user.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).send("Registration error");
  }
};

/* LOGIN */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0)
      return res.status(400).json("User not found");

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword)
      return res.status(401).json("Invalid password");

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: user.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Login error");
  }
};