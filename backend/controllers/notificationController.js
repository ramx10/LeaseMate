const pool = require("../db");

/* GET NOTIFICATIONS FOR LOGGED IN USER */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch only unread notifications, limit to 20
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 AND is_read = false ORDER BY created_at DESC LIMIT 20",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Error fetching notifications");
  }
};

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
exports.createNotification = async (userId, type, title, message) => {
  try {
    await pool.query(
      "INSERT INTO notifications (user_id, type, title, message) VALUES ($1,$2,$3,$4)",
      [userId, type, title, message]
    );
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
