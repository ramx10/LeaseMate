const pool = require("../db");

const getDashboardStats = async (req, res) => {
  try {
    const totalTenants = await pool.query("SELECT COUNT(*) FROM tenants");
    const totalProperties = await pool.query("SELECT COUNT(*) FROM properties");
    const totalRooms = await pool.query("SELECT COUNT(*) FROM rooms");

    const rentReceived = await pool.query(
      "SELECT SUM(total) FROM ledger WHERE paid = true"
    );

    const pendingRent = await pool.query(
      "SELECT SUM(total) FROM ledger WHERE paid = false"
    );

   res.json({
  totalTenants: Number(totalTenants.rows[0].count),
  totalProperties: Number(totalProperties.rows[0].count),
  totalRooms: Number(totalRooms.rows[0].count),
  rentReceived: Number(rentReceived.rows[0].sum) || 0,
  pendingRent: Number(pendingRent.rows[0].sum) || 0
});
  } catch (error) {
    console.error(error);
    res.status(500).send("Dashboard error");
  }
};

module.exports = {
  getDashboardStats
};