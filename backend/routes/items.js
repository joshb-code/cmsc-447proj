const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemsController');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', authorizeAdmin, controller.update);
router.delete('/:id', authorizeAdmin, controller.remove);
router.post('/:id/update-quantity', controller.updateQuantity);

module.exports = router;
