const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

router.get('/', controller.getAll);
router.get('/most-taken', controller.getMostTaken);
router.get('/:user_id', controller.getByUser);
router.post('/', controller.create);

module.exports = router;
