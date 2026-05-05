const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "leasemate_db",
  password: process.env.PGPASSWORD || "1234",
  port: process.env.PGPORT || 5432,
});

module.exports = pool;