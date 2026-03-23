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
        ledger.tenant_id,
        ledger.month,
        ledger.rent,
        ledger.electricity,
        ledger.total,
        ledger.paid,
        tenants.phone,
        users.name AS tenant_name,
        rooms.room_number,
        properties.property_name
      FROM ledger
      JOIN tenants ON ledger.tenant_id = tenants.id
      JOIN users ON tenants.user_id = users.id
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


/* GENERATE MONTHLY LEDGER FOR A ROOM */
exports.generateMonthlyLedger = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const { month, electricity, room_id } = req.body;

    if (!month || !room_id) {
      return res.status(400).json({ error: "Month and Room are required" });
    }

    // Verify room belongs to owner
    const roomCheck = await pool.query(`
      SELECT rooms.id, rooms.total_rent, rooms.max_tenants
      FROM rooms
      JOIN properties ON rooms.property_id = properties.id
      WHERE rooms.id = $1 AND properties.owner_id = $2
    `, [room_id, owner_id]);

    if (roomCheck.rows.length === 0) {
      return res.status(403).json({ error: "Room not found or unauthorized" });
    }

    // Get all tenants in this room
    const tenantsResult = await pool.query(
      "SELECT id AS tenant_id FROM tenants WHERE room_id = $1",
      [room_id]
    );

    if (tenantsResult.rows.length === 0) {
      return res.json({ message: "No tenants in this room", created: 0, skipped: 0 });
    }

    const tenantCount = tenantsResult.rows.length;
    const totalRent = Number(roomCheck.rows[0].total_rent);
    const totalElectricity = Number(electricity) || 0;

    const rentPerTenant = Math.floor(totalRent / tenantCount);
    const elecPerTenant = Math.floor(totalElectricity / tenantCount);
    const totalPerTenant = rentPerTenant + elecPerTenant;

    let created = 0;
    let skipped = 0;

    for (const tenant of tenantsResult.rows) {
      // Check if entry already exists for this tenant+month
      const existing = await pool.query(
        "SELECT id FROM ledger WHERE tenant_id = $1 AND month = $2",
        [tenant.tenant_id, month]
      );

      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO ledger (tenant_id, month, rent, electricity, total)
         VALUES ($1, $2, $3, $4, $5)`,
        [tenant.tenant_id, month, rentPerTenant, elecPerTenant, totalPerTenant]
      );

      created++;
    }

    res.json({
      message: `Generated ${created} bill${created !== 1 ? 's' : ''}${skipped > 0 ? `, skipped ${skipped} (already exist)` : ''}`,
      created,
      skipped,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating ledger entries");
  }
};