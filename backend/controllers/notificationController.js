const pool = require("../db");

/* GET NOTIFICATIONS FOR LOGGED IN USER */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // 1. Check for automatic "Overdue" reminders if it's past the 10th
    const now = new Date();
    const currentDay = now.getDate();
    if (role === "Tenant" && currentDay >= 10) {
      await checkAndCreateOverdueReminders(userId);
    }

    // 2. Fetch all effective unread notifications
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 AND is_read = false AND effective_date <= CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 20",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Error fetching notifications");
  }
};

/* INTERNAL HELPER: Check for unpaid bills and create reminders if >= 10th */
async function checkAndCreateOverdueReminders(userId) {
  try {
    // Get tenant ID
    const tQuery = await pool.query("SELECT id FROM tenants WHERE user_id = $1", [userId]);
    if (tQuery.rows.length === 0) return;
    const tenantId = tQuery.rows[0].id;

    // Find unpaid ledger entries for this month or past months
    const unpaid = await pool.query(
      "SELECT id, month, total FROM ledger WHERE tenant_id = $1 AND paid = false",
      [tenantId]
    );

    for (const record of unpaid.rows) {
      // Check if we already sent an "Overdue" reminder for this specific ledger entry
      const checkNotif = await pool.query(
        "SELECT id FROM notifications WHERE user_id = $1 AND type = 'rent_overdue' AND message LIKE $2",
        [userId, `%${record.month}%`]
      );

      if (checkNotif.rows.length === 0) {
        // Create the persistent reminder
        await exports.createNotification(
          userId,
          "rent_overdue",
          "URGENT: Rent Overdue",
          `Reminder: Your rent for ${record.month} (₹${record.total}) is past the 10th and remains unpaid. Please clear it soon.`
        );
      }
    }
  } catch (err) {
    console.error("Error in overdue check:", err);
  }
}

/* MARK NOTIFICATION AS READ */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send("Error updating notification");
  }
};

/* CLEAR ALL NOTIFICATIONS */
exports.clearAll = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1",
      [userId]
    );

    res.json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).send("Error clearing notifications");
  }
};

/* HELPER TO CREATE NOTIFICATION (Internal use) */
exports.createNotification = async (userId, type, title, message, effectiveDate = null) => {
  try {
    const finalDate = effectiveDate || new Date();
    await pool.query(
      "INSERT INTO notifications (user_id, type, title, message, effective_date) VALUES ($1,$2,$3,$4,$5)",
      [userId, type, title, message, finalDate]
    );
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
