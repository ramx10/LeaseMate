const pool = require("../db");

/* DASHBOARD SUMMARY */
exports.getDashboard = async (req, res) => {
  try {

    const tenants = await pool.query(
      "SELECT COUNT(*) FROM tenants"
    );

    const properties = await pool.query(
      "SELECT COUNT(*) FROM properties"
    );

    const rooms = await pool.query(
      "SELECT COUNT(*) FROM rooms"
    );

    const pending = await pool.query(`
      SELECT COALESCE(SUM(total),0) AS pending_rent
      FROM ledger
      WHERE paid = false
    `);

    res.json({
      totalTenants: tenants.rows[0].count,
      totalProperties: properties.rows[0].count,
      totalRooms: rooms.rows[0].count,
      pending_rent: pending.rows[0].pending_rent
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching dashboard");
  }
};