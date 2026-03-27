const pool = require('./db');
const fs = require('fs');

async function check() {
  try {
    const users = await pool.query('SELECT * FROM users');
    const properties = await pool.query('SELECT * FROM properties');
    const rooms = await pool.query('SELECT * FROM rooms');
    const tenants = await pool.query('SELECT * FROM tenants');

    const dump = {
      users: users.rows,
      properties: properties.rows,
      rooms: rooms.rows,
      tenants: tenants.rows
    };

    fs.writeFileSync('db_dump.json', JSON.stringify(dump, null, 2));
    console.log('Successfully wrote to db_dump.json');
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    pool.end();
  }
}

check();
