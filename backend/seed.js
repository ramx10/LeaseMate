const pool = require("./db");
const bcrypt = require("bcryptjs");

async function seedData() {
  try {
    console.log("Starting DB seeding...");

    // Clear existing data
    await pool.query("TRUNCATE TABLE shared_expenses CASCADE");
    await pool.query("TRUNCATE TABLE issues CASCADE");
    await pool.query("TRUNCATE TABLE electricity_bills CASCADE");
    await pool.query("TRUNCATE TABLE rent_payments CASCADE");
    await pool.query("TRUNCATE TABLE tenants CASCADE");
    await pool.query("TRUNCATE TABLE rooms CASCADE");
    await pool.query("TRUNCATE TABLE properties CASCADE");
    await pool.query("TRUNCATE TABLE users CASCADE");

    // 1. Create Users
    const ownerPassword = await bcrypt.hash("owner123", 10);
    const tenantPassword = await bcrypt.hash("tenant123", 10);

    const ownerRes = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Admin Owner", "owner@example.com", ownerPassword, "Owner"]
    );
    const ownerId = ownerRes.rows[0].id;

    const tenantRes = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Rahul Tenant", "tenant@example.com", tenantPassword, "Tenant"]
    );
    const userIdTenant = tenantRes.rows[0].id;

    // 2. Create Property & Room
    const propertyRes = await pool.query(
      "INSERT INTO properties (owner_id, property_name, address) VALUES ($1, $2, $3) RETURNING id",
      [ownerId, "Sunshine Heights", "123 Main St"]
    );
    const propertyId = propertyRes.rows[0].id;

    const roomRes = await pool.query(
      "INSERT INTO rooms (property_id, room_number, total_rent, max_tenants) VALUES ($1, $2, $3, $4) RETURNING id",
      [propertyId, "101", 12000, 3]
    );
    const roomId = roomRes.rows[0].id;

    // 3. Create Tenant Profile
    const tenantProfileRes = await pool.query(
      "INSERT INTO tenants (user_id, room_id, phone, deposit, join_date) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING id",
      [userIdTenant, roomId, "9876543210", 15000]
    );
    const tenantId = tenantProfileRes.rows[0].id;

    // 4. Create Electricity Bills
    await pool.query(
      "INSERT INTO electricity_bills (room_id, previous_reading, current_reading, unit_rate, total_units, total_amount, bill_month) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [roomId, 1000, 1150, 8, 150, 1200, "Feb 2026"]
    );
    await pool.query(
      "INSERT INTO electricity_bills (room_id, previous_reading, current_reading, unit_rate, total_units, total_amount, bill_month) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [roomId, 1150, 1330, 8, 180, 1440, "Mar 2026"]
    );

    // 5. Create Rent Payments
    const currentMonth = new Date().toLocaleString("en-US", { month: "short", year: "numeric" });
    await pool.query(
      "INSERT INTO rent_payments (tenant_id, month, rent_amount, electricity_amount, total_amount, status, payment_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)",
      [tenantId, "Feb 2026", 4000, 400, 4400, "Paid"]
    );
    await pool.query(
      "INSERT INTO rent_payments (tenant_id, month, rent_amount, electricity_amount, total_amount, status, payment_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)",
      [tenantId, currentMonth, 4000, 480, 4480, "Pending"]
    );

    // 6. Create Shared Expenses
    await pool.query(
      "INSERT INTO shared_expenses (room_id, paid_by, expense_name, amount) VALUES ($1, $2, $3, $4)",
      [roomId, tenantId, "WiFi Bill", 800]
    );
    await pool.query(
      "INSERT INTO shared_expenses (room_id, paid_by, expense_name, amount) VALUES ($1, $2, $3, $4)",
      [roomId, tenantId, "Room Cleaning", 300]
    );

    console.log("DB Seeding completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
