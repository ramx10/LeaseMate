const pool = require("../db");

/* ADD TENANT */
exports.addTenant = async (req, res) => {
  try {

    const { room_id, phone, deposit } = req.body;

    const newTenant = await pool.query(
      "INSERT INTO tenants (room_id, phone, deposit) VALUES ($1,$2,$3) RETURNING *",
      [room_id, phone, deposit]
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

    const tenants = await pool.query(`
      SELECT
        tenants.id,
        tenants.phone,
        tenants.deposit,
        tenants.join_date,
        rooms.room_number,
        properties.property_name
      FROM tenants
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      ORDER BY tenants.id
    `);

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

    await pool.query(
      "DELETE FROM tenants WHERE id=$1",
      [id]
    );

    res.json("Tenant deleted");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting tenant");
  }
};