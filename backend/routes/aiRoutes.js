const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { explain } = require('../controllers/aiController');

router.use(requireAuth);
router.post('/explain', explain);

module.exports = router;
