const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

router.get('/', controller.getAll);
router.get('/:user_id', controller.getOneByUser);
router.post('/', controller.create);

module.exports = router;
