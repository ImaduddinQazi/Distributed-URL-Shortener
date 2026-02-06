const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/database');
const { pingRedis } = require('./config/redis');
const urlRoutes = require('./routes/url.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Test database
    const dbResult = await db.query('SELECT NOW()');
    
    // Test Redis
    const redisStatus = await pingRedis();
    
    res.status(200).json({ 
      status: 'ok', 
      message: 'Server is running',
      database: 'connected',
      redis: redisStatus ? 'connected' : 'disconnected',
      timestamp: dbResult.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      error: error.message
    });
  }
});

// URL routes
app.use('/', urlRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});