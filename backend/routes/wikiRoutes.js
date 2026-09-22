const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { searchWiki, define } = require('../controllers/wikiController');
const { webSearch } = require('../controllers/webSearchController');

router.use(requireAuth);
router.get('/search', searchWiki);
router.get('/define', define);
router.get('/web', webSearch);

module.exports = router;
