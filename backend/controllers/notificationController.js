const pool = require("../db");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; 
    
    const currentDay = new Date().getDate();
    let alertLevel = "Normal";

    if (currentDay > 10) alertLevel = "Danger";
    else if (currentDay > 5) alertLevel = "Medium";

    let notifications = [];

    if (role === "Tenant") {
        if (currentDay <= 5) return res.json([]);

        // Get tenant's own id
        const tenantQuery = await pool.query("SELECT id FROM tenants WHERE user_id = $1", [userId]);
        if (tenantQuery.rows.length === 0) return res.json([]);
        const tenantId = tenantQuery.rows[0].id;

        const result = await pool.query(`
          SELECT 
            users.name AS tenant_name,
            rooms.room_number,
            ledger.total AS amount_due,
            ledger.month,
            ledger.id AS ledger_id
          FROM ledger
          JOIN tenants ON ledger.tenant_id = tenants.id
          JOIN users ON tenants.user_id = users.id
          JOIN rooms ON tenants.room_id = rooms.id
          WHERE ledger.paid = false AND ledger.tenant_id = $1
          ORDER BY ledger.id DESC
          LIMIT 10
        `, [tenantId]);

        notifications = result.rows.map(row => ({
          id: row.ledger_id,
          type: "rent_due",
          tenantName: row.tenant_name || "You",
          roomNumber: row.room_number,
          amount: Math.round(row.amount_due),
          month: row.month,
          title: alertLevel === "Danger" ? "URGENT: Rent Overdue" : "Reminder: Rent is Due",
          time: "Pending",
          level: alertLevel
        }));

    } else {
        // Owner
        const result = await pool.query(`
          SELECT 
            users.name AS tenant_name,
            rooms.room_number,
            ledger.total AS amount_due,
            ledger.month,
            ledger.id AS ledger_id
          FROM ledger
          JOIN tenants ON ledger.tenant_id = tenants.id
          JOIN users ON tenants.user_id = users.id
          JOIN rooms ON tenants.room_id = rooms.id
          JOIN properties ON rooms.property_id = properties.id
          WHERE ledger.paid = false AND properties.owner_id = $1
          ORDER BY ledger.id DESC
          LIMIT 10
        `, [userId]);

        notifications = result.rows.map(row => ({
          id: row.ledger_id,
          type: "rent_due",
          tenantName: row.tenant_name || "Unknown",
          roomNumber: row.room_number,
          amount: Math.round(row.amount_due),
          month: row.month,
          title: "Rent Due",
          time: "Pending",
          level: "Danger"
        }));
    }

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Error fetching notifications");
  }
};
