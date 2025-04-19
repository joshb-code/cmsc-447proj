const db = require('../db');

exports.getAll = (req, res) => {
  // Check if there's a vendor_id filter
  const vendorId = req.query.vendor_id;
  
  if (vendorId) {
    console.log(`Fetching items for vendor ID: ${vendorId}`);
    db.query('SELECT * FROM items WHERE vendor_id = ?', [vendorId], (err, rows) => {
      if (err) {
        console.error('Error fetching vendor items:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      console.log(`Found ${rows.length} items for vendor ID ${vendorId}`);
      res.json(rows);
    });
  } else {
    // No filter, get all items
    db.query('SELECT * FROM items', (err, rows) => {
      if (err) {
        console.error('Error fetching all items:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      console.log(`Retrieved all ${rows.length} items`);
      res.json(rows);
    });
  }
};

exports.getOne = (req, res) => {
  db.query('SELECT * FROM items WHERE product_id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows[0]);
  });
};

exports.create = (req, res) => {
  console.log('Creating new item with data:', req.body);
  
  // Validate required fields
  const { product_id, product_name, description, type, vendor_id, price_per_unit } = req.body;
  
  if (!product_id || !product_id.trim()) {
    console.log('Missing product_id in request');
    return res.status(400).json({ error: 'Product ID is required' });
  }
  
  if (!product_name) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  
  if (!type) {
    return res.status(400).json({ error: 'Type is required' });
  }
  
  if (!vendor_id) {
    return res.status(400).json({ error: 'Vendor ID is required' });
  }
  
  if (!price_per_unit) {
    return res.status(400).json({ error: 'Price per unit is required' });
  }
  
  // Process the data for insertion
  const itemData = {
    product_id: product_id.trim(),
    product_name: product_name.trim(),
    description: description.trim(),
    type: type.trim(),
    vendor_id,
    price_per_unit,
    weight_amount: req.body.weight_amount || null,
    order_quantity: req.body.order_quantity || null
  };
  
  console.log('Attempting to insert item with data:', itemData);
  
  db.query('INSERT INTO items SET ?', itemData, (err, result) => {
    if (err) {
      console.error('Error inserting item:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    console.log('Item created successfully with ID:', result.insertId);
    res.status(201).json({ 
      message: 'Item created successfully',
      id: result.insertId,
      item: itemData
    });
  });
};

exports.update = (req, res) => {
  db.query('UPDATE items SET ? WHERE product_id = ?', [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Item updated' });
  });
};

exports.remove = (req, res) => {
  db.query('DELETE FROM items WHERE product_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Item deleted' });
  });
};

exports.updateQuantity = (req, res) => {
  const { product_id, quantity, weight } = req.body;
  
  // Validate input
  if (!product_id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }
  
  if (quantity === undefined && weight === undefined) {
    return res.status(400).json({ error: 'Either quantity or weight must be provided' });
  }
  
  // First, get the current item to check available quantity/weight
  db.query('SELECT * FROM items WHERE product_id = ?', [product_id], (err, rows) => {
    if (err) {
      console.error('Error fetching item:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = rows[0];
    
    // Check if requested amount is available
    if (quantity !== undefined && item.order_quantity !== null) {
      if (quantity > item.order_quantity) {
        return res.status(400).json({ error: 'Requested quantity exceeds available stock' });
      }
    }
    
    if (weight !== undefined && item.weight_amount !== null) {
      if (weight > item.weight_amount) {
        return res.status(400).json({ error: 'Requested weight exceeds available stock' });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (quantity !== undefined && item.order_quantity !== null) {
      updateData.order_quantity = item.order_quantity - quantity;
    }
    if (weight !== undefined && item.weight_amount !== null) {
      updateData.weight_amount = item.weight_amount - weight;
    }
    
    // Update the item
    db.query('UPDATE items SET ? WHERE product_id = ?', [updateData, product_id], (err) => {
      if (err) {
        console.error('Error updating item:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      res.json({ 
        message: 'Item quantity updated successfully',
        updatedItem: { ...item, ...updateData }
      });
    });
  });
};
