const pool = require("../db");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; 

    let notifications = [];

    if (role === "Tenant") {
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

        notifications = processNotifications(result.rows, role);

        // Fetch tenant issue updates (In Progress / Resolved)
        const tenantIssues = await pool.query(`
          SELECT issues.id, issues.category, issues.status, rooms.room_number
          FROM issues
          JOIN tenants ON issues.tenant_id = tenants.id
          JOIN rooms ON tenants.room_id = rooms.id
          WHERE issues.tenant_id = $1 AND issues.status != 'Pending'
          ORDER BY issues.id DESC
          LIMIT 5
        `, [tenantId]);

        const tenantIssueNotifs = tenantIssues.rows.map(row => ({
          id: `issue_${row.id}`,
          type: "issue_update",
          tenantName: "You",
          roomNumber: row.room_number,
          amount: null,
          month: "Issue",
          title: `Issue ${row.status}`,
          description: row.category,
          time: "Update",
          level: row.status === "Resolved" ? "Normal" : "Medium"
        }));

        notifications.push(...tenantIssueNotifs);

    } else {
        // Owner (Rent notifications omitted for Owners by request)

        // Fetch owner new issues (Pending)
        const pendingIssues = await pool.query(`
          SELECT issues.id, issues.category, users.name as tenant_name, rooms.room_number
          FROM issues
          JOIN tenants ON issues.tenant_id = tenants.id
          JOIN users ON tenants.user_id = users.id
          JOIN rooms ON tenants.room_id = rooms.id
          JOIN properties ON rooms.property_id = properties.id
          WHERE issues.status = 'Pending' AND properties.owner_id = $1
          ORDER BY issues.id DESC
          LIMIT 5
        `, [userId]);

        const ownerIssueNotifs = pendingIssues.rows.map(row => ({
          id: `issue_${row.id}`,
          type: "new_issue",
          tenantName: row.tenant_name || "Unknown",
          roomNumber: row.room_number,
          amount: null,
          month: "Issue",
          title: "New Issue Reported",
          description: row.category,
          time: "Pending",
          level: "Medium"
        }));

        notifications.push(...ownerIssueNotifs);
    }

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Error fetching notifications");
  }
};

function processNotifications(rows, role) {
  const validNotifications = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  for (const row of rows) {
    // row.month is typically like "April 2026"
    const ledgerDate = new Date(row.month + " 1");
    // check if valid date
    if (isNaN(ledgerDate.getTime())) continue;

    const ledgerYear = ledgerDate.getFullYear();
    const ledgerMonth = ledgerDate.getMonth();
    
    const monthDiff = (currentYear - ledgerYear) * 12 + (currentMonth - ledgerMonth);

    let rowAlertLevel = "Normal";
    let title = "Rent Due";
    let showNotification = true;

    if (monthDiff < 0) {
       // Future month: don't show as a notification (not yet due)
       showNotification = false; 
    } else if (monthDiff === 0) {
       // Current month
       if (currentDay <= 5) {
          showNotification = false; // Not strict due yet, usually due 1st-5th
       } else if (currentDay > 10) {
          rowAlertLevel = "Danger";
          title = "URGENT: Rent Overdue";
       } else {
          rowAlertLevel = "Medium";
          title = "Reminder: Rent is Due";
       }
    } else {
       // Past months -> ALWAYS overdue
       rowAlertLevel = "Danger";
       title = "URGENT: Rent Overdue";
    }

    if (showNotification) {
       validNotifications.push({
          id: row.ledger_id,
          type: "rent_due",
          tenantName: row.tenant_name || (role === "Tenant" ? "You" : "Unknown"),
          roomNumber: row.room_number,
          amount: Math.round(row.amount_due),
          month: row.month,
          title: title,
          time: "Pending",
          level: rowAlertLevel
       });
    }
  }
  return validNotifications;
}
