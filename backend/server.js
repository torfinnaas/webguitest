const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'your-rds-endpoint.amazonaws.com',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'your-password',
  database: process.env.DB_NAME || 'user_management',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.status(200).json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching user with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  const { name, age } = req.body;
  
  // Validate input
  if (!name || age === undefined) {
    return res.status(400).json({ error: 'Name and age are required' });
  }
  
  try {
    const id = uuidv4().substring(0, 8); // Generate a shorter UUID for ID
    await pool.query('INSERT INTO users (id, name, age) VALUES (?, ?, ?)', [id, name, age]);
    
    res.status(201).json({ id, name, age });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  const { name, age } = req.body;
  const { id } = req.params;
  
  // Validate input
  if (!name && age === undefined) {
    return res.status(400).json({ error: 'At least one field (name or age) is required for update' });
  }
  
  try {
    // Check if user exists
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (age !== undefined) {
      updates.push('age = ?');
      values.push(age);
    }
    
    values.push(id); // Add ID for WHERE clause
    
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    
    // Get updated user
    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.json(updatedUser[0]);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`Error deleting user with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
