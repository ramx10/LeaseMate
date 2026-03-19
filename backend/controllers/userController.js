const pool = require("../db");

/* GET MY PROFILE (authenticated user) */
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "Tenant") {
      const result = await pool.query(`
        SELECT u.id, u.name, u.email, u.role, u.created_at,
               t.phone, t.deposit, t.join_date,
               r.room_number, r.total_rent,
               p.property_name, p.address, p.area
        FROM users u
        LEFT JOIN tenants t ON u.id = t.user_id
        LEFT JOIN rooms r ON t.room_id = r.id
        LEFT JOIN properties p ON u.property_id = p.id
        WHERE u.id = $1
      `, [userId]);

      if (result.rows.length === 0) return res.status(404).json("User not found");
      res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
        [userId]
      );

      if (result.rows.length === 0) return res.status(404).json("User not found");
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching profile");
  }
};

/* GET UNASSIGNED TENANT USERS (filtered by owner's properties) */
exports.getUnassignedTenants = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const unassignedTenantsQuery = await pool.query(`
      SELECT u.id, u.name, u.email, p.property_name
      FROM users u
      LEFT JOIN tenants t ON u.id = t.user_id
      JOIN properties p ON u.property_id = p.id
      WHERE u.role = 'Tenant' AND t.id IS NULL
        AND p.owner_id = $1
      ORDER BY u.name ASC
    `, [owner_id]);

    res.json(unassignedTenantsQuery.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching unassigned tenants");
  }
};
