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
    order_quantity: req.body.order_quantity || null,
    // Set default limits based on whether it's a weight or quantity item
    max_signout_quantity: req.body.weight_amount ? null : 5,
    max_signout_weight: req.body.weight_amount ? 10 : null
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
    
    // Determine if item uses weight or quantity
    const usesWeight = item.weight_amount !== null && item.weight_amount > 0;
    const usesQuantity = item.order_quantity !== null && item.order_quantity > 0;
    
    // Validate that we're using the correct measurement type
    if (usesWeight && quantity !== undefined) {
      return res.status(400).json({ error: 'This item is measured by weight, not quantity' });
    }
    if (usesQuantity && weight !== undefined) {
      return res.status(400).json({ error: 'This item is measured by quantity, not weight' });
    }
    
    // Check if requested amount is available
    if (usesQuantity && quantity > item.order_quantity) {
      return res.status(400).json({ error: 'Requested quantity exceeds available stock' });
    }
    
    if (usesWeight && weight > item.weight_amount) {
      return res.status(400).json({ error: 'Requested weight exceeds available stock' });
    }
    
    // Prepare update data
    const updateData = {};
    if (usesQuantity) {
      updateData.order_quantity = item.order_quantity - quantity;
    }
    if (usesWeight) {
      updateData.weight_amount = item.weight_amount - weight;
    }
    
    // If no update data was prepared, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid update data prepared' });
    }
    
    // Update the item
    const updateFields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const updateValues = [...Object.values(updateData), product_id];
    
    const sql = `UPDATE items SET ${updateFields} WHERE product_id = ?`;
    console.log('Executing SQL query:', sql, 'with values:', updateValues);
    
    db.query(sql, updateValues, (err) => {
      if (err) {
        console.error('Error updating item:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      res.json({ 
        message: 'Item updated successfully',
        updatedItem: { ...item, ...updateData }
      });
    });
  });
};

// Get low stock items
exports.getLowStock = (req, res) => {
  console.log('Fetching low stock items...');
  
  // Get thresholds from query parameters, default to 5 for quantity and 10 for weight
  const quantityThreshold = parseInt(req.query.quantity) || 5;
  const weightThreshold = parseFloat(req.query.weight) || 10;
  
  console.log('Using thresholds:', { quantityThreshold, weightThreshold });
  
  const query = `
    SELECT 
      product_id,
      product_name,
      type,
      weight_amount,
      order_quantity
    FROM items
    WHERE 
      (
        -- Weight-based items with low stock
        weight_amount > 0 AND 
        weight_amount <= ? AND 
        (order_quantity = 0 OR order_quantity IS NULL)
      )
      OR
      (
        -- Quantity-based items with low stock
        order_quantity > 0 AND 
        order_quantity <= ? AND 
        (weight_amount = 0 OR weight_amount IS NULL)
      )
    ORDER BY 
      CASE 
        WHEN weight_amount > 0 THEN weight_amount
        ELSE order_quantity
      END ASC
    LIMIT 10
  `;

  db.query(query, [weightThreshold, quantityThreshold], (err, rows) => {
    if (err) {
      console.error('Error fetching low stock items:', err);
      return res.status(500).json({ error: 'Failed to fetch low stock items', details: err.message });
    }
    
    console.log('Low stock items query result:', rows);
    
    // Ensure we always return a valid array
    const responseData = Array.isArray(rows) ? rows : [];
    
    // Log the response data
    console.log('Sending response data:', responseData);
    
    // Send the response
    res.json(responseData);
  });
};

// Update global limits for all items
exports.updateGlobalLimits = (req, res) => {
  const { quantity, weight } = req.body;
  console.log('Received global limits update request:', { quantity, weight });

  // Validate input
  if (quantity === undefined && weight === undefined) {
    return res.status(400).json({ error: 'Either quantity or weight must be provided' });
  }

  // Build the SQL update query
  let updateFields = [];
  let updateValues = [];
  
  if (quantity !== undefined) {
    updateFields.push('max_signout_quantity = ?');
    updateValues.push(quantity);
  }
  if (weight !== undefined) {
    updateFields.push('max_signout_weight = ?');
    updateValues.push(weight);
  }

  const sql = `UPDATE items SET ${updateFields.join(', ')}`;
  console.log('Executing SQL query:', sql, 'with values:', updateValues);

  // Update all items
  db.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error('Error updating global limits:', err);
      return res.status(500).json({ error: 'Failed to update global limits', details: err.message });
    }

    console.log('Global limits update result:', result);
    res.json({ 
      message: 'Global limits updated successfully',
      affectedRows: result.affectedRows
    });
  });
};
