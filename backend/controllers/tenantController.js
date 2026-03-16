const pool = require("../db");

/* ADD TENANT */
exports.addTenant = async (req, res) => {
  try {

    const { user_id, room_id, phone, deposit } = req.body;

    const newTenant = await pool.query(
      "INSERT INTO tenants (user_id, room_id, phone, deposit, join_date) VALUES ($1,$2,$3,$4, CURRENT_DATE) RETURNING *",
      [user_id, room_id, phone, deposit]
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
        users.name AS tenant_name,
        users.email AS tenant_email,
        tenants.phone,
        tenants.deposit,
        tenants.join_date,
        rooms.room_number,
        properties.property_name
      FROM tenants
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      LEFT JOIN users ON tenants.user_id = users.id
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

    // delete ledger records
    await pool.query(
      "DELETE FROM ledger WHERE tenant_id=$1",
      [id]
    );

    // delete tenant
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