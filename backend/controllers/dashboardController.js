const pool = require("../db");

/* DASHBOARD STATS */
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


/* MONTHLY RENT COLLECTION */
const getRentAnalytics = async (req, res) => {
  try {

    const data = await pool.query(`
      SELECT
        month,
        SUM(total) as total_rent
      FROM ledger
      GROUP BY month
      ORDER BY month
    `);

    res.json(data.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching analytics");
  }
};


/* PAID VS PENDING */
const getPaymentAnalytics = async (req, res) => {
  try {

    const data = await pool.query(`
      SELECT
        paid,
        COUNT(*) as count
      FROM ledger
      GROUP BY paid
    `);

    res.json(data.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching payments");
  }
};


/* EXPORT FUNCTIONS */
module.exports = {
  getDashboardStats,
  getRentAnalytics,
  getPaymentAnalytics
};