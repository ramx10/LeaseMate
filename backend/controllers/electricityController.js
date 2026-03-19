const pool = require("../db");

/* ADD ELECTRICITY BILL */
exports.addBill = async (req, res) => {
  try {
    const { room_id, previous_reading, current_reading, unit_rate, bill_month } = req.body;
    const owner_id = req.user.id;

    // Verify room ownership
    const room = await pool.query(
      `SELECT rooms.id FROM rooms
       JOIN properties ON rooms.property_id = properties.id
       WHERE rooms.id = $1 AND properties.owner_id = $2`,
      [room_id, owner_id]
    );

    if (room.rows.length === 0) {
      return res.status(404).send("Room not found or unauthorized");
    }

    const total_units = Number(current_reading) - Number(previous_reading);
    const total_amount = total_units * Number(unit_rate);

    const bill = await pool.query(
      `INSERT INTO electricity_bills
       (room_id, previous_reading, current_reading, unit_rate, total_units, total_amount, bill_month)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [room_id, previous_reading, current_reading, unit_rate, total_units, total_amount, bill_month]
    );

    res.json(bill.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding electricity bill");
  }
};

/* GET ELECTRICITY BILLS */
exports.getBills = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const bills = await pool.query(
      `SELECT
        electricity_bills.*,
        rooms.room_number,
        properties.property_name
       FROM electricity_bills
       JOIN rooms ON electricity_bills.room_id = rooms.id
       JOIN properties ON rooms.property_id = properties.id
       WHERE properties.owner_id = $1
       ORDER BY electricity_bills.id DESC`,
      [owner_id]
    );

    res.json(bills.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching electricity bills");
  }
};

/* DELETE ELECTRICITY BILL */
exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.id;

    // Verify ownership
    const billCheck = await pool.query(
      `SELECT electricity_bills.id
       FROM electricity_bills
       JOIN rooms ON electricity_bills.room_id = rooms.id
       JOIN properties ON rooms.property_id = properties.id
       WHERE electricity_bills.id = $1 AND properties.owner_id = $2`,
      [id, owner_id]
    );

    if (billCheck.rows.length === 0) {
      return res.status(403).json("Unauthorized or not found");
    }

    await pool.query("DELETE FROM electricity_bills WHERE id = $1", [id]);

    res.json("Electricity bill deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting electricity bill");
  }
};
