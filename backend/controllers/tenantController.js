const pool = require("../db");

/* ADD TENANT */
exports.addTenant = async (req, res) => {
  try {
    const { user_id, room_id, phone, deposit, join_date } = req.body;

    const newTenant = await pool.query(
      "INSERT INTO tenants (user_id, room_id, phone, deposit, join_date) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [user_id, room_id, phone, deposit, join_date]
    );

    res.json(newTenant.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding tenant");
  }
};

/* GET TENANTS */
exports.getTenants = async (req, res) => {
  try {
    const tenants = await pool.query("SELECT * FROM tenants");
    res.json(tenants.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tenants");
  }
};

/* DELETE TENANT */
exports.deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM tenants WHERE id=$1", [id]);

    res.json("Tenant removed");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting tenant");
  }
};