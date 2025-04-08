const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1095',
  database: process.env.DB_NAME || 'inventory',
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Root route
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

// Optional: DELETE item
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

// Optional: POST (add) new item
app.post('/api/inventory', (req, res) => {
  const {
    product_name,
    weight_amount,
    price_per_unit,
    order_quantity,
    description,
    type,
    vendor_id
  } = req.body;

  const query = `
    INSERT INTO inventory_items 
    (product_name, weight_amount, price_per_unit, order_quantity, description, type, vendor_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [product_name, weight_amount, price_per_unit, order_quantity, description, type, vendor_id],
    (err, result) => {
      if (err) {
        console.error('❌ Error adding item:', err);
        return res.status(500).json({ error: 'Failed to add item' });
      }
      res.status(201).json({ message: '✅ Item added', product_id: result.insertId });
    }
  );
});


// Routes

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api/inventory`);
});
