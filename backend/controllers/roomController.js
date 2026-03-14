const pool = require("../db");

/* ADD ROOM */
exports.addRoom = async (req, res) => {
  try {
    const { property_id, room_number, total_rent, max_tenants } = req.body;

    const newRoom = await pool.query(
      "INSERT INTO rooms (property_id, room_number, total_rent, max_tenants) VALUES ($1,$2,$3,$4) RETURNING *",
      [property_id, room_number, total_rent, max_tenants]
    );

    res.json(newRoom.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding room");
  }
};

/* GET ROOMS */
exports.getRooms = async (req, res) => {
  try {
    const rooms = await pool.query("SELECT * FROM rooms");
    res.json(rooms.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching rooms");
  }
};

/* DELETE ROOM */
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM rooms WHERE id=$1", [id]);

    res.json("Room deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting room");
  }
};