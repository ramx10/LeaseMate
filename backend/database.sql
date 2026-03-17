CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password TEXT,
    role VARCHAR(20),
    property_id INT REFERENCES properties(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id),
    property_name VARCHAR(100),
    address TEXT,
    area VARCHAR(100),
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
CREATE TABLE rent_payments (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id),
    month VARCHAR(20),
    rent_amount INT,
    electricity_amount INT,
    total_amount INT,
    status VARCHAR(20),
    payment_date DATE
);
CREATE TABLE electricity_bills (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id),
    previous_reading INT,
    current_reading INT,
    unit_rate INT,
    total_units INT,
    total_amount INT,
    bill_month VARCHAR(20)
);
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id),
    category VARCHAR(50),
    description TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE shared_expenses (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id),
    paid_by INT REFERENCES tenants(id),
    expense_name VARCHAR(100),
    amount INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);