const express = require('express');
const { shortenURL, redirectURL, getURLStats } = require('../controllers/url.controller');

const router = express.Router();

// POST /shorten - Create short URL
router.post('/shorten', shortenURL);

// GET /stats/:short_code - Get URL analytics
router.get('/stats/:short_code', getURLStats);

// GET /:short_code - Redirect to long URL (MUST BE LAST)
router.get('/:short_code', redirectURL);

module.exports = router;