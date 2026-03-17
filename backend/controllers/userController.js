const pool = require("../db");

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
