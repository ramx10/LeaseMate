const pool = require("../db");

exports.reportIssue = async (req, res) => {
  try {
    const { category, description } = req.body;
    const userId = req.user.id;

    // Get tenant_id
    const tenantQuery = await pool.query("SELECT id FROM tenants WHERE user_id = $1", [userId]);
    if (tenantQuery.rows.length === 0) {
      return res.status(404).send("Tenant not found");
    }
    const tenantId = tenantQuery.rows[0].id;

    const newIssue = await pool.query(
      "INSERT INTO issues (tenant_id, category, description, status) VALUES ($1, $2, $3, 'Pending') RETURNING *",
      [tenantId, category, description]
    );

    res.json(newIssue.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error reporting issue");
  }
};

exports.getIssues = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let issues;

    if (role === "Tenant") {
      const tenantQuery = await pool.query("SELECT id FROM tenants WHERE user_id = $1", [userId]);
      if (tenantQuery.rows.length === 0) return res.json([]);
      const tenantId = tenantQuery.rows[0].id;

      const result = await pool.query(`
        SELECT issues.*, properties.property_name, rooms.room_number 
        FROM issues
        JOIN tenants ON issues.tenant_id = tenants.id
        JOIN rooms ON tenants.room_id = rooms.id
        JOIN properties ON rooms.property_id = properties.id
        WHERE issues.tenant_id = $1
        ORDER BY issues.created_at DESC
      `, [tenantId]);
      issues = result.rows;
    } else {
      // Owner
      const result = await pool.query(`
        SELECT issues.*, users.name as tenant_name, properties.property_name, rooms.room_number 
        FROM issues
        JOIN tenants ON issues.tenant_id = tenants.id
        JOIN users ON tenants.user_id = users.id
        JOIN rooms ON tenants.room_id = rooms.id
        JOIN properties ON rooms.property_id = properties.id
        WHERE properties.owner_id = $1
        ORDER BY issues.created_at DESC
      `, [userId]);
      issues = result.rows;
    }

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching issues");
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Update issue
    await pool.query(
      "UPDATE issues SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    res.json({ message: "Issue updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating issue status");
  }
};
