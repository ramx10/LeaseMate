CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password TEXT,
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id),
    property_name VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(id),
    room_number VARCHAR(20),
    total_rent INT,
    max_tenants INT
);
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    room_id INT REFERENCES rooms(id),
    phone VARCHAR(20),
    deposit INT,
    join_date DATE
);