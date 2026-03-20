const pool = require("../db");

/* DASHBOARD SUMMARY */
exports.getDashboard = async (req, res) => {
  try {

    const owner_id = req.user.id;

    const tenants = await pool.query(`
      SELECT COUNT(tenants.*) 
      FROM tenants 
      JOIN rooms ON tenants.room_id = rooms.id 
      JOIN properties ON rooms.property_id = properties.id 
      WHERE properties.owner_id = $1
    `, [owner_id]);

    const properties = await pool.query(
      "SELECT COUNT(*) FROM properties WHERE owner_id = $1",
      [owner_id]
    );

    const rooms = await pool.query(`
      SELECT COUNT(rooms.*) 
      FROM rooms 
      JOIN properties ON rooms.property_id = properties.id 
      WHERE properties.owner_id = $1
    `, [owner_id]);

    const pending = await pool.query(`
      SELECT COALESCE(SUM(ledger.total - ledger.amount_paid), 0) AS pending_rent
      FROM ledger
      JOIN tenants ON ledger.tenant_id = tenants.id
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      WHERE ledger.paid = false AND properties.owner_id = $1
    `, [owner_id]);

    const paid = await pool.query(`
      SELECT COALESCE(SUM(ledger.amount_paid), 0) AS paid_rent
      FROM ledger
      JOIN tenants ON ledger.tenant_id = tenants.id
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      WHERE properties.owner_id = $1
    `, [owner_id]);

    res.json({
      totalTenants: tenants.rows[0].count,
      totalProperties: properties.rows[0].count,
      totalRooms: rooms.rows[0].count,
      pending_rent: pending.rows[0].pending_rent,
      paid_rent: paid.rows[0].paid_rent
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching dashboard");
  }
};


/* RENT ANALYTICS — monthly rent collection */
exports.getRentAnalytics = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const result = await pool.query(`
      SELECT ledger.month, SUM(ledger.total) AS total_rent
      FROM ledger
      JOIN tenants ON ledger.tenant_id = tenants.id
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      WHERE properties.owner_id = $1
      GROUP BY ledger.month
      ORDER BY MIN(ledger.id)
    `, [owner_id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching rent analytics");
  }
};


/* PAYMENT ANALYTICS — paid vs pending count */
exports.getPaymentAnalytics = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const result = await pool.query(`
      SELECT ledger.paid, COUNT(*) AS count
      FROM ledger
      JOIN tenants ON ledger.tenant_id = tenants.id
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      WHERE properties.owner_id = $1
      GROUP BY ledger.paid
    `, [owner_id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching payment analytics");
  }
};