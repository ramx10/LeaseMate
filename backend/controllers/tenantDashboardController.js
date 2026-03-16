const pool = require("../db");

exports.getTenantDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get tenant details including room_id
    const tenantQuery = await pool.query(
      "SELECT id, room_id, deposit FROM tenants WHERE user_id = $1",
      [userId]
    );

    if (tenantQuery.rows.length === 0) {
      return res.status(404).json("Tenant profile not found for this user");
    }

    const tenantId = tenantQuery.rows[0].id;
    const roomId = tenantQuery.rows[0].room_id;

    // 2. Get current month's rent payment status
    const currentMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
    const rentQuery = await pool.query(
      "SELECT rent as rent_amount, electricity as electricity_amount, total as total_amount, (CASE WHEN paid THEN 'Paid' ELSE 'Pending' END) as status FROM ledger WHERE tenant_id = $1 AND month = $2",
      [tenantId, currentMonth]
    );

    const rentData = rentQuery.rows.length > 0 ? rentQuery.rows[0] : null;

    // 3. Get total spending (historical)
    const statsQuery = await pool.query(
      "SELECT SUM(total) as total_spend FROM ledger WHERE tenant_id = $1 AND paid = true",
      [tenantId]
    );

    // 4. Get electricity comparison logic (last 2 readings for the room)
    const electricityQuery = await pool.query(
      "SELECT total_units, bill_month FROM electricity_bills WHERE room_id = $1 ORDER BY id DESC LIMIT 2",
      [roomId]
    );

    // 5. Shared expenses for this room
    const sharedExpensesQuery = await pool.query(
      `SELECT se.id, se.expense_name, se.amount, se.created_at, u.name as paid_by_name
       FROM shared_expenses se
       JOIN tenants t ON se.paid_by = t.id
       JOIN users u ON t.user_id = u.id
       WHERE se.room_id = $1
       ORDER BY se.created_at DESC LIMIT 5`,
      [roomId]
    );

    res.json({
      rentBreakdown: rentData,
      totalSpent: statsQuery.rows[0].total_spend || 0,
      electricityHistory: electricityQuery.rows,
      recentSharedExpenses: sharedExpensesQuery.rows,
      deposit: tenantQuery.rows[0].deposit
    });

  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching tenant dashboard data");
  }
};
