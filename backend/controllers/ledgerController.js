const pool = require("../db");

/* ADD LEDGER ENTRY */
exports.addLedger = async (req, res) => {
  try {
    const { tenant_id, month, rent, electricity } = req.body;

    const total = rent + electricity;

    const newEntry = await pool.query(
      "INSERT INTO ledger (tenant_id, month, rent, electricity, total) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [tenant_id, month, rent, electricity, total]
    );

    res.json(newEntry.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding ledger entry");
  }
};


/* GET LEDGER */
exports.getLedger = async (req, res) => {
  try {

    const ledger = await pool.query("SELECT * FROM ledger");

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

    await pool.query(
      "UPDATE ledger SET paid = true WHERE id=$1",
      [id]
    );

    res.json("Payment marked as paid");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating payment");
  }
};