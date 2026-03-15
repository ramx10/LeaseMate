const pool = require("../db");

/* ADD PROPERTY */
exports.addProperty = async (req, res) => {
  try {
    const { property_name, address } = req.body;

    const newProperty = await pool.query(
  "INSERT INTO properties (property_name, address) VALUES ($1,$2) RETURNING *",
  [property_name, address]
);

    res.json(newProperty.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding property");
  }
};

/* GET ALL PROPERTIES */
exports.getProperties = async (req, res) => {
  try {
    const properties = await pool.query("SELECT * FROM properties");

    res.json(properties.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching properties");
  }
};

/* DELETE PROPERTY */
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM properties WHERE id=$1", [id]);

    res.json("Property deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting property");
  }
};