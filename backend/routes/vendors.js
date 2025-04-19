const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendorsController');
const authorizeAdmin = require('../middleware/authorizeAdmin');

/**
 * Vendor API Routes
 * 
 * GET / - Retrieve all vendors (public access)
 * GET /:id - Retrieve a specific vendor by ID (public access)
 * GET /:id/items - Retrieve all items for a specific vendor (public access)
 * POST / - Create a new vendor (restricted to admin users)
 * PUT /:id - Update an existing vendor (restricted to admin users)
 * DELETE /:id - Remove a vendor (restricted to admin users)
 */

// Public routes - No authorization required
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.get('/:id/items', controller.getVendorItems);

// Protected routes - Admin authorization required
// These routes use the authorizeAdmin middleware to ensure only admins can perform these operations
router.post('/', authorizeAdmin, controller.create);
router.put('/:id', authorizeAdmin, controller.update);
router.delete('/:id', authorizeAdmin, controller.remove);

module.exports = router;
