const pool = require("../db");

/* ADD PROPERTY */
exports.addProperty = async (req, res) => {
  try {
    const { property_name, address } = req.body;

    const owner_id = req.user.id;

    const newProperty = await pool.query(
      "INSERT INTO properties (owner_id, property_name, address) VALUES ($1,$2,$3) RETURNING *",
      [owner_id, property_name, address]
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
    const owner_id = req.user.id;
    const properties = await pool.query("SELECT * FROM properties WHERE owner_id = $1", [owner_id]);

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
    const owner_id = req.user.id;

    // First ensure the property belongs to the owner before deleting
    const propCheck = await pool.query("SELECT * FROM properties WHERE id = $1 AND owner_id = $2", [id, owner_id]);
    if (propCheck.rows.length === 0) {
      return res.status(403).json("Unauthorized or not found");
    }

    // delete rooms under this property
    await pool.query(
      "DELETE FROM rooms WHERE property_id = $1",
      [id]
    );

    // delete the property
    await pool.query(
      "DELETE FROM properties WHERE id = $1 AND owner_id = $2",
      [id, owner_id]
    );

    res.json("Property deleted");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting property");
  }
};