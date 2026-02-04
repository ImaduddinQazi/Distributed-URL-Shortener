const express = require('express');
const { shortenURL, redirectURL } = require('../controllers/url.controller');

const router = express.Router();

// POST /shorten - Create short URL
router.post('/shorten', shortenURL);

// GET /:short_code - Redirect to long URL
router.get('/:short_code', redirectURL);

module.exports = router;