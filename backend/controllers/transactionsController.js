const db = require('../db');

exports.getAll = (req, res) => {
  db.query('SELECT * FROM transactions', (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

exports.getOneByUser = (req, res) => {
  db.query('SELECT * FROM transactions WHERE user_id = ?', [req.params.user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { user_id, product_id, quantity_taken, user_role } = req.body;

  const query = `
    INSERT INTO transactions (user_id, product_id, quantity_taken, user_role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [user_id, product_id, quantity_taken, user_role], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Transaction recorded', id: result.insertId });
  });
};
