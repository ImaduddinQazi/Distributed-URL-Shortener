const express = require('express');
const { 
  shortenURL, 
  redirectURL, 
  getURLStats,
  getClickAnalytics 
} = require('../controllers/url.controller');

const router = express.Router();

// POST /shorten - Create short URL
router.post('/shorten', shortenURL);

// GET /stats/:short_code - Get URL analytics
router.get('/stats/:short_code', getURLStats);

// GET /analytics/:short_code - Get click analytics (NEW)
router.get('/analytics/:short_code', getClickAnalytics);

// GET /:short_code - Redirect to long URL (MUST BE LAST)
router.get('/:short_code', redirectURL);

module.exports = router;