const db = require('../config/database');
const { encode, decode } = require('../utils/base62');
const { getCache, setCache, deleteCache } = require('../config/redis');
const { generateQRCode } = require('../utils/qrcode');

/**
 * Shorten a long URL
 */
async function shortenURL(req, res) {
  try {
    const { long_url, custom_code, expires_in } = req.body;
    
    // Validation
    if (!long_url) {
      return res.status(400).json({ 
        error: 'long_url is required' 
      });
    }
    
    // Validate URL format
    try {
      new URL(long_url);
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid URL format' 
      });
    }
    
    // Check for duplicate URL (optional optimization)
    const existingUrl = await db.query(
      'SELECT short_code FROM urls WHERE long_url = $1 LIMIT 1',
      [long_url]
    );
    
    if (existingUrl.rows.length > 0) {
      const short_code = existingUrl.rows[0].short_code;
      const short_url = `${req.protocol}://${req.get('host')}/${short_code}`;
      
      // Generate QR code for existing URL
      const qr_code = await generateQRCode(short_url);
      
      return res.status(200).json({
        short_url,
        short_code,
        long_url,
        qr_code,
        message: 'URL already exists'
      });
    }
    
    // Calculate expiry
    let expires_at = null;
    if (expires_in) {
      expires_at = new Date(Date.now() + expires_in * 1000);
    }
    
    // Insert into database
    const result = await db.query(
      'INSERT INTO urls (long_url, short_code, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [long_url, 'temp', expires_at]
    );
    
    const id = result.rows[0].id;
    const short_code = custom_code || encode(id);
    
    // Update with actual short_code
    await db.query(
      'UPDATE urls SET short_code = $1 WHERE id = $2',
      [short_code, id]
    );
    
    // Build short URL
    const short_url = `${req.protocol}://${req.get('host')}/${short_code}`;
    
    // Generate QR code
    const qr_code = await generateQRCode(short_url);
    
    // Pre-populate cache (write-through)
    await setCache(`url:${short_code}`, long_url);
    
    res.status(201).json({
      short_url,
      short_code,
      long_url,
      qr_code,
      expires_at,
      created_at: result.rows[0].created_at
    });
    
  } catch (error) {
    console.error('Error shortening URL:', error);
    
    // Handle duplicate short_code
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: 'Short code already exists. Try a different custom code.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

/**
 * Redirect to long URL (with caching)
 */
/**
 * Redirect to long URL (with caching and click logging)
 */
async function redirectURL(req, res) {
  try {
    const { short_code } = req.params;
    const cacheKey = `url:${short_code}`;
    
    // Step 1: Check Redis cache
    let long_url = await getCache(cacheKey);
    
    if (long_url) {
      console.log(`✅ Cache HIT for ${short_code}`);
      
      // Log click (async, don't wait)
      db.query(
        'INSERT INTO click_logs (short_code) VALUES ($1)',
        [short_code]
      ).catch(err => console.error('Error logging click:', err));
      
      // Increment click count (async, don't wait)
      db.query(
        'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
        [short_code]
      ).catch(err => console.error('Error updating click count:', err));
      
      return res.redirect(301, long_url);
    }
    
    // Step 2: Cache MISS - Fetch from database
    console.log(`❌ Cache MISS for ${short_code}`);
    
    const result = await db.query(
      'SELECT long_url, expires_at FROM urls WHERE short_code = $1',
      [short_code]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Short URL not found' 
      });
    }
    
    long_url = result.rows[0].long_url;
    const expires_at = result.rows[0].expires_at;
    
    // Check if expired
    if (expires_at && new Date(expires_at) < new Date()) {
      return res.status(410).json({ 
        error: 'Short URL has expired' 
      });
    }
    
    // Step 3: Store in cache for next time
    await setCache(cacheKey, long_url);
    console.log(`💾 Cached ${short_code} for future requests`);
    
    // Log click (async, don't wait)
    db.query(
      'INSERT INTO click_logs (short_code) VALUES ($1)',
      [short_code]
    ).catch(err => console.error('Error logging click:', err));
    
    // Increment click count (async, don't wait)
    db.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
      [short_code]
    ).catch(err => console.error('Error updating click count:', err));
    
    // Step 4: Redirect
    res.redirect(301, long_url);
    
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

/**
 * Get URL analytics
 */
async function getURLStats(req, res) {
  try {
    const { short_code } = req.params;
    
    const result = await db.query(
      'SELECT * FROM urls WHERE short_code = $1',
      [short_code]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Short URL not found' 
      });
    }
    
    const urlData = result.rows[0];
    
    // Check cache status
    const cacheKey = `url:${short_code}`;
    const isCached = await getCache(cacheKey) !== null;
    
    // Build short URL
    const short_url = `${req.protocol}://${req.get('host')}/${short_code}`;
    
    // Generate QR code
    const qr_code = await generateQRCode(short_url);
    
    res.status(200).json({
      short_code: urlData.short_code,
      short_url,
      long_url: urlData.long_url,
      created_at: urlData.created_at,
      expires_at: urlData.expires_at,
      click_count: urlData.click_count,
      is_cached: isCached,
      qr_code
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

/**
 * Get click analytics with time series data
 */
async function getClickAnalytics(req, res) {
  try {
    const { short_code } = req.params;
    
    // Check if URL exists
    const urlCheck = await db.query(
      'SELECT * FROM urls WHERE short_code = $1',
      [short_code]
    );
    
    if (urlCheck.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Short URL not found' 
      });
    }
    
    // Get clicks grouped by day (last 30 days)
    const clicksByDay = await db.query(
      `SELECT 
        DATE(clicked_at) as date,
        COUNT(*) as clicks
      FROM click_logs
      WHERE short_code = $1 
        AND clicked_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(clicked_at)
      ORDER BY date ASC`,
      [short_code]
    );
    
    // Get clicks grouped by hour (last 24 hours)
    const clicksByHour = await db.query(
      `SELECT 
        DATE_TRUNC('hour', clicked_at) as hour,
        COUNT(*) as clicks
      FROM click_logs
      WHERE short_code = $1 
        AND clicked_at >= NOW() - INTERVAL '24 hours'
      GROUP BY DATE_TRUNC('hour', clicked_at)
      ORDER BY hour ASC`,
      [short_code]
    );
    
    res.status(200).json({
      short_code,
      total_clicks: urlCheck.rows[0].click_count,
      clicks_by_day: clicksByDay.rows,
      clicks_by_hour: clicksByHour.rows
    });
    
  } catch (error) {
    console.error('Error fetching click analytics:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

module.exports = { 
  shortenURL, 
  redirectURL,
  getURLStats,
  getClickAnalytics
};