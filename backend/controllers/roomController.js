const pool = require("../db");

/* ADD ROOM */
exports.addRoom = async (req, res) => {
  try {
    const { property_id, room_number, total_rent, max_tenants } = req.body;

    const owner_id = req.user.id;

    // Verify property belongs to owner
    const propCheck = await pool.query("SELECT * FROM properties WHERE id = $1 AND owner_id = $2", [property_id, owner_id]);
    if (propCheck.rows.length === 0) {
      return res.status(403).json("Unauthorized. Property does not belong to you.");
    }

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

/* GET ROOMS WITH PROPERTY NAME */
exports.getRooms = async (req, res) => {
  try {

    const owner_id = req.user.id;

    const rooms = await pool.query(`
      SELECT
        rooms.id,
        rooms.room_number,
        rooms.total_rent,
        rooms.max_tenants,
        rooms.property_id,
        properties.property_name
      FROM rooms
      JOIN properties
      ON rooms.property_id = properties.id
      WHERE properties.owner_id = $1
      ORDER BY rooms.id
    `, [owner_id]);

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
    const owner_id = req.user.id;

    // Verify room belongs to a property owned by the user
    const roomCheck = await pool.query(`
      SELECT rooms.id 
      FROM rooms 
      JOIN properties ON rooms.property_id = properties.id 
      WHERE rooms.id = $1 AND properties.owner_id = $2
    `, [id, owner_id]);
    
    if (roomCheck.rows.length === 0) {
      return res.status(403).json("Unauthorized or not found");
    }

    // Remove tenants first
    await pool.query(
      "DELETE FROM tenants WHERE room_id=$1",
      [id]
    );

    // Then delete room
    await pool.query(
      "DELETE FROM rooms WHERE id=$1",
      [id]
    );

    res.json("Room deleted");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting room");
  }
};