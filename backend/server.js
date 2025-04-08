const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// MySQL database connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1095',
  database: process.env.DB_NAME || 'inventory',
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Root route - API health check
app.get('/', (req, res) => {
  res.send('🚀 Inventory API is running');
});

// GET all inventory items
app.get('/api/inventory', (req, res) => {
  const query = 'SELECT * FROM inventory_items';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching items:', err);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
    res.json(results);
  });
});

// GET a single item by product_id
app.get('/api/inventory/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM inventory_items WHERE product_id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Error fetching item:', err);
      return res.status(500).json({ error: 'Failed to fetch item' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(results[0]);
  });
});

// PUT (update) an item by product_id
app.put('/api/inventory/:id', (req, res) => {
  const id = req.params.id;
  const {
    product_name,
    weight_amount,
    price_per_unit,
    order_quantity,
    description,
    type,
  } = req.body;

  // SQL query to update item
  const query = `
    UPDATE inventory_items
    SET product_name = ?, weight_amount = ?, price_per_unit = ?, order_quantity = ?, description = ?, type = ?
    WHERE product_id = ?
  `;

  db.query(
    query,
    [product_name, weight_amount, price_per_unit, order_quantity, description, type, id],
    (err, result) => {
      if (err) {
        console.error('❌ Error updating item:', err);
        return res.status(500).json({ error: 'Failed to update item' });
      }
      res.json({ message: '✅ Item updated successfully' });
    }
  );
});

// DELETE item by product_id
app.delete('/api/inventory/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM inventory_items WHERE product_id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting item:', err);
      return res.status(500).json({ error: 'Failed to delete item' });
    }
    res.json({ message: '✅ Item deleted successfully' });
  });
});

// POST (add) new item
app.post('/api/inventory', (req, res) => {
  // Extract item data from request body
  const {
    product_name,
    weight_amount,
    price_per_unit,
    order_quantity,
    description,
    type,
    vendor_id
  } = req.body;

  // SQL query to insert new item
  const query = `
    INSERT INTO inventory_items 
    (product_name, weight_amount, price_per_unit, order_quantity, description, type, vendor_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute query with item data
  db.query(
    query,
    [product_name, weight_amount, price_per_unit, order_quantity, description, type, vendor_id],
    (err, result) => {
      if (err) {
        console.error('❌ Error adding item:', err);
        return res.status(500).json({ error: 'Failed to add item' });
      }
      // Return success message with new item's ID
      res.status(201).json({ message: '✅ Item added', product_id: result.insertId });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api/inventory`);
});
