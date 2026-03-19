const pool = require("../db");

/* ADD TENANT */
exports.addTenant = async (req, res) => {
  try {

    const { user_id, room_id, phone, deposit } = req.body;

    const owner_id = req.user.id;

    // Verify room belongs to owner and get its capacity
    const roomCheck = await pool.query(`
      SELECT rooms.id, rooms.max_tenants 
      FROM rooms 
      JOIN properties ON rooms.property_id = properties.id 
      WHERE rooms.id = $1 AND properties.owner_id = $2
    `, [room_id, owner_id]);
    
    if (roomCheck.rows.length === 0) {
      return res.status(403).json("Unauthorized. Room does not belong to you.");
    }

    const maxCapacity = roomCheck.rows[0].max_tenants;

    // Check current occupancy
    const occupantCheck = await pool.query(`
      SELECT COUNT(*) as current_occupants 
      FROM tenants 
      WHERE room_id = $1
    `, [room_id]);

    const currentOccupants = parseInt(occupantCheck.rows[0].current_occupants, 10);

    if (currentOccupants >= maxCapacity) {
      return res.status(400).json(`Room is full. Maximum capacity is ${maxCapacity} tenants.`);
    }

    const newTenant = await pool.query(
      "INSERT INTO tenants (user_id, room_id, phone, deposit, join_date) VALUES ($1,$2,$3,$4, CURRENT_DATE) RETURNING *",
      [user_id, room_id, phone, deposit]
    );

    res.json(newTenant.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding tenant");
  }
};

/* GET TENANTS */
exports.getTenants = async (req, res) => {
  try {

    const owner_id = req.user.id;

    const tenants = await pool.query(`
      SELECT
        tenants.id,
        tenants.room_id,
        users.name AS tenant_name,
        users.email AS tenant_email,
        tenants.phone,
        tenants.deposit,
        tenants.join_date,
        rooms.room_number,
        properties.property_name
      FROM tenants
      JOIN rooms ON tenants.room_id = rooms.id
      JOIN properties ON rooms.property_id = properties.id
      LEFT JOIN users ON tenants.user_id = users.id
      WHERE properties.owner_id = $1
      ORDER BY tenants.id
    `, [owner_id]);

    res.json(tenants.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tenants");
  }
};

/* DELETE TENANT */
exports.deleteTenant = async (req, res) => {
  try {

    const { id } = req.params;
    const owner_id = req.user.id;

    // Verify tenant belongs to owner
    const tenantCheck = await pool.query(`
      SELECT tenants.id 
      FROM tenants 
      JOIN rooms ON tenants.room_id = rooms.id 
      JOIN properties ON rooms.property_id = properties.id 
      WHERE tenants.id = $1 AND properties.owner_id = $2
    `, [id, owner_id]);
    
    if (tenantCheck.rows.length === 0) {
      return res.status(403).json("Unauthorized or not found");
    }

    // delete ledger records
    await pool.query(
      "DELETE FROM ledger WHERE tenant_id=$1",
      [id]
    );

    // delete tenant
    await pool.query(
      "DELETE FROM tenants WHERE id=$1",
      [id]
    );

    res.json("Tenant deleted");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting tenant");
  }
};