const db = require('../config/database');
const { encode, decode } = require('../utils/base62');

/**
 * Shorten a long URL
 */
async function shortenURL(req, res) {
  try {
    const { long_url } = req.body;
    
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
    
    // Insert into database
    const result = await db.query(
      'INSERT INTO urls (long_url, short_code) VALUES ($1, $2) RETURNING *',
      [long_url, 'temp'] // We'll update short_code next
    );
    
    const id = result.rows[0].id;
    const short_code = encode(id);
    
    // Update with actual short_code
    await db.query(
      'UPDATE urls SET short_code = $1 WHERE id = $2',
      [short_code, id]
    );
    
    // Build short URL
    const short_url = `${req.protocol}://${req.get('host')}/${short_code}`;
    
    res.status(201).json({
      short_url,
      short_code,
      long_url,
      created_at: result.rows[0].created_at
    });
    
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

/**
 * Redirect to long URL
 */
async function redirectURL(req, res) {
  try {
    const { short_code } = req.params;
    
    // Fetch from database
    const result = await db.query(
      'SELECT long_url FROM urls WHERE short_code = $1',
      [short_code]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Short URL not found' 
      });
    }
    
    const long_url = result.rows[0].long_url;
    
    // Increment click count (optional - fire and forget)
    db.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
      [short_code]
    ).catch(err => console.error('Error updating click count:', err));
    
    // Redirect
    res.redirect(301, long_url);
    
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

module.exports = { shortenURL, redirectURL };