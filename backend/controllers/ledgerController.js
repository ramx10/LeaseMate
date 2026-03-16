const pool = require("../db");

/* ADD LEDGER ENTRY */
exports.addLedger = async (req, res) => {
  try {

    const { tenant_id, month, electricity } = req.body;

    const owner_id = req.user.id;

    // get room info and verify ownership
    const room = await pool.query(`
      SELECT rooms.total_rent, rooms.max_tenants
      FROM tenants
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      WHERE tenants.id = $1 AND properties.owner_id = $2
    `, [tenant_id, owner_id]);

    if (room.rows.length === 0) {
      return res.status(404).send("Tenant not found or unauthorized");
    }

    const totalRent = Number(room.rows[0].total_rent);
    const maxTenants = Number(room.rows[0].max_tenants);

    const rent = Math.floor(totalRent / maxTenants);
    const electricityCost = Number(electricity) || 0;

    const total = rent + electricityCost;

    const ledger = await pool.query(
      `INSERT INTO ledger
       (tenant_id, month, rent, electricity, total)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [tenant_id, month, rent, electricityCost, total]
    );

    res.json(ledger.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding ledger");
  }
};


/* GET LEDGER */
exports.getLedger = async (req, res) => {
  try {

    const owner_id = req.user.id;

    const ledger = await pool.query(`
      SELECT
        ledger.id,
        ledger.month,
        ledger.rent,
        ledger.electricity,
        ledger.total,
        ledger.paid,
        tenants.phone,
        rooms.room_number,
        properties.property_name
      FROM ledger
      JOIN tenants ON ledger.tenant_id = tenants.id
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      WHERE properties.owner_id = $1
      ORDER BY ledger.id
    `, [owner_id]);

    res.json(ledger.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching ledger");
  }
};


/* MARK AS PAID */
exports.markPaid = async (req, res) => {
  try {

    const { id } = req.params;
    const owner_id = req.user.id;

    // Verify ownership
    const ledgerCheck = await pool.query(`
      SELECT ledger.id
      FROM ledger
      JOIN tenants ON ledger.tenant_id = tenants.id
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      WHERE ledger.id = $1 AND properties.owner_id = $2
    `, [id, owner_id]);

    if (ledgerCheck.rows.length === 0) {
      return res.status(403).json("Unauthorized or not found");
    }

    await pool.query(
      "UPDATE ledger SET paid=true WHERE id=$1",
      [id]
    );

    res.json("Payment marked as paid");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating payment");
  }
};