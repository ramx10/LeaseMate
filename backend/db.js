const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "host.docker.internal", // 🔥 CHANGE HERE
  database: process.env.PGDATABASE || "leasemate_db",
  password: process.env.PGPASSWORD || "1234",
  port: process.env.PGPORT || 5432,
});