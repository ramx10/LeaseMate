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

    // 1. Create Owner Users
    const ownerPassword = await bcrypt.hash("owner123", 10);
    const tenantPassword = await bcrypt.hash("tenant123", 10);

    const owner1Res = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Admin Owner", "owner@example.com", ownerPassword, "Owner"]
    );
    const owner1Id = owner1Res.rows[0].id;

    const owner2Res = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Priya Owner", "priya@example.com", ownerPassword, "Owner"]
    );
    const owner2Id = owner2Res.rows[0].id;

    // 2. Create Properties (with area)
    const prop1Res = await pool.query(
      "INSERT INTO properties (owner_id, property_name, address, area) VALUES ($1, $2, $3, LOWER($4)) RETURNING id",
      [owner1Id, "Manet PG", "Near MIT College", "loni kalbhor"]
    );
    const prop1Id = prop1Res.rows[0].id;

    const prop2Res = await pool.query(
      "INSERT INTO properties (owner_id, property_name, address, area) VALUES ($1, $2, $3, LOWER($4)) RETURNING id",
      [owner1Id, "Sunshine Heights", "Main Road", "kothrud"]
    );
    const prop2Id = prop2Res.rows[0].id;

    const prop3Res = await pool.query(
      "INSERT INTO properties (owner_id, property_name, address, area) VALUES ($1, $2, $3, LOWER($4)) RETURNING id",
      [owner2Id, "Tara City", "Ramdhara Road", "loni kalbhor"]
    );
    const prop3Id = prop3Res.rows[0].id;

    // 3. Create Tenant Users (with property_id linking to their building)
    const tenant1Res = await pool.query(
      "INSERT INTO users (name, email, password, role, property_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      ["Rahul Sharma", "rahul@example.com", tenantPassword, "Tenant", prop1Id]
    );
    const tenant1UserId = tenant1Res.rows[0].id;

    const tenant2Res = await pool.query(
      "INSERT INTO users (name, email, password, role, property_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      ["Sneha Patil", "sneha@example.com", tenantPassword, "Tenant", prop1Id]
    );
    const tenant2UserId = tenant2Res.rows[0].id;

    const tenant3Res = await pool.query(
      "INSERT INTO users (name, email, password, role, property_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      ["Amit Desai", "amit@example.com", tenantPassword, "Tenant", prop3Id]
    );
    const tenant3UserId = tenant3Res.rows[0].id;

    // 4. Create Rooms
    const room1Res = await pool.query(
      "INSERT INTO rooms (property_id, room_number, total_rent, max_tenants) VALUES ($1, $2, $3, $4) RETURNING id",
      [prop1Id, "101", 12000, 3]
    );
    const room1Id = room1Res.rows[0].id;

    const room2Res = await pool.query(
      "INSERT INTO rooms (property_id, room_number, total_rent, max_tenants) VALUES ($1, $2, $3, $4) RETURNING id",
      [prop2Id, "201", 10000, 2]
    );
    const room2Id = room2Res.rows[0].id;

    const room3Res = await pool.query(
      "INSERT INTO rooms (property_id, room_number, total_rent, max_tenants) VALUES ($1, $2, $3, $4) RETURNING id",
      [prop3Id, "A1", 8000, 2]
    );
    const room3Id = room3Res.rows[0].id;

    // 5. Create Tenant Profiles (assign to rooms)
    const tenantProfile1Res = await pool.query(
      "INSERT INTO tenants (user_id, room_id, phone, deposit, join_date) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING id",
      [tenant1UserId, room1Id, "9876543210", 15000]
    );
    const tenantProfile1Id = tenantProfile1Res.rows[0].id;

    // Sneha is unassigned (registered for Manet PG but not yet added to a room)
    // Amit is unassigned (registered for Tara City but not yet added to a room)

    // 6. Create Electricity Bills
    await pool.query(
      "INSERT INTO electricity_bills (room_id, previous_reading, current_reading, unit_rate, total_units, total_amount, bill_month) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [room1Id, 1000, 1150, 8, 150, 1200, "Feb 2026"]
    );
    await pool.query(
      "INSERT INTO electricity_bills (room_id, previous_reading, current_reading, unit_rate, total_units, total_amount, bill_month) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [room1Id, 1150, 1330, 8, 180, 1440, "Mar 2026"]
    );

    // 7. Create Rent Payments
    const currentMonth = new Date().toLocaleString("en-US", { month: "short", year: "numeric" });
    await pool.query(
      "INSERT INTO rent_payments (tenant_id, month, rent_amount, electricity_amount, total_amount, status, payment_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)",
      [tenantProfile1Id, "Feb 2026", 4000, 400, 4400, "Paid"]
    );
    await pool.query(
      "INSERT INTO rent_payments (tenant_id, month, rent_amount, electricity_amount, total_amount, status, payment_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)",
      [tenantProfile1Id, currentMonth, 4000, 480, 4480, "Pending"]
    );

    // 8. Create Shared Expenses
    await pool.query(
      "INSERT INTO shared_expenses (room_id, paid_by, expense_name, amount) VALUES ($1, $2, $3, $4)",
      [room1Id, tenantProfile1Id, "WiFi Bill", 800]
    );
    await pool.query(
      "INSERT INTO shared_expenses (room_id, paid_by, expense_name, amount) VALUES ($1, $2, $3, $4)",
      [room1Id, tenantProfile1Id, "Room Cleaning", 300]
    );

    console.log("DB Seeding completed successfully!");
    console.log("");
    console.log("=== Test Accounts ===");
    console.log("Owner 1: owner@example.com / owner123  (Manet PG + Sunshine Heights)");
    console.log("Owner 2: priya@example.com / owner123  (Tara City)");
    console.log("Tenant:  rahul@example.com / tenant123 (assigned to Manet PG Room 101)");
    console.log("Tenant:  sneha@example.com / tenant123 (unassigned — registered for Manet PG)");
    console.log("Tenant:  amit@example.com  / tenant123 (unassigned — registered for Tara City)");
    console.log("");
    console.log("=== Areas ===");
    console.log("loni kalbhor: Manet PG (Owner 1), Tara City (Owner 2)");
    console.log("kothrud: Sunshine Heights (Owner 1)");

    process.exit(0);

  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
