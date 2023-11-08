-- View all tables in selected database
SELECT table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
ORDER BY table_name;

-- remove existing tables (if necessary)
IF OBJECT_ID('table_name', 'U') IS NOT NULL DROP TABLE UserActions;

-- Create tables using the SQL below
-- Reuse various datatypes, set up table structures depending on schema
CREATE TABLE UserActions (
    userLog_id INT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    action_name VARCHAR(50) NOT NULL,
    action_timestamp DATETIME NOT NULL,
    details VARCHAR(1000)
);

CREATE TABLE Users (
    user_id INT PRIMARY KEY NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(30) NOT NULL,
    fullName CHAR(50) NOT NULL,
    registration_date DATETIME NOT NULL,
    last_login DATETIME,
    user_address VARCHAR(50),
    user_phone_number VARCHAR(50)
);

CREATE TABLE Endpoints (
    endpoint_id INT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    endpoint_name VARCHAR(255) NOT NULL,
    endpoint_type VARCHAR(50) NOT NULL,
    endpoint_desc VARCHAR(1000),
    url VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    authentication_required BIT,
    created_on DATETIME NOT NULL,
    last_used DATETIME
);

CREATE TABLE Roles (
    role_id INT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    date_allocated DATETIME NOT NULL
);

CREATE TABLE RolePermissions (
    permission_id INT PRIMARY KEY NOT NULL,
    permission_name VARCHAR(20) NOT NULL,
    permission_desc VARCHAR(1000) NOT NULL
);
