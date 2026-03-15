const pool = require("../db");

/* ADD LEDGER ENTRY */
exports.addLedger = async (req, res) => {
  try {

    const { tenant_id, month, rent, electricity } = req.body;

    const total = Number(rent) + Number(electricity);

    const ledger = await pool.query(
      `INSERT INTO ledger
      (tenant_id, month, rent, electricity, total)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [tenant_id, month, rent, electricity, total]
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
      ORDER BY ledger.id
    `);

    res.json(ledger.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching ledger");
  }
};


/* MARK PAID */
exports.markPaid = async (req, res) => {
  try {

    const { id } = req.params;

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