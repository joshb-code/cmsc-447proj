const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) return console.error('DB Error:', err);
  console.log('✅ Connected to MySQL');
});

app.get('/api/items', (req, res) => {
  db.query('SELECT * FROM inventory_items', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch items' });
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}/api/items`));
