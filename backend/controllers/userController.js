const pool = require("../db");

/* GET UNASSIGNED TENANT USERS */
exports.getUnassignedTenants = async (req, res) => {
  try {
    const unassignedTenantsQuery = await pool.query(`
      SELECT u.id, u.name, u.email 
      FROM users u
      LEFT JOIN tenants t ON u.id = t.user_id
      WHERE u.role = 'Tenant' AND t.id IS NULL
      ORDER BY u.name ASC
    `);

    res.json(unassignedTenantsQuery.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching unassigned tenants");
  }
};
