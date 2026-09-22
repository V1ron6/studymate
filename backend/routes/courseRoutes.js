const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { list, create, remove } = require('../controllers/courseController');

router.use(requireAuth);
router.get('/', list);
router.post('/', create);
router.delete('/:id', remove);

module.exports = router;
