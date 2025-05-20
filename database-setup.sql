-- Database setup script for MySQL RDS instance

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS user_management;

-- Use the database
USE user_management;

-- Create users table with specified columns
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL
);

-- Add some sample data
INSERT INTO users (id, name, age) VALUES
('usr-001', 'John Doe', 28),
('usr-002', 'Jane Smith', 34),
('usr-003', 'Michael Johnson', 42),
('usr-004', 'Emily Davis', 25),
('usr-005', 'Robert Wilson', 31);

-- Create an index on the name column for faster searches
CREATE INDEX idx_name ON users(name);

-- Grant permissions (adjust as needed for your RDS setup)
-- GRANT ALL PRIVILEGES ON user_management.* TO 'your_rds_username'@'%';
-- FLUSH PRIVILEGES;
