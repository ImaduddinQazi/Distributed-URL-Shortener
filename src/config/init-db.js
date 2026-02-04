const db = require('./database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('📦 Initializing database...');
    
    // Read SQL file
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    );
    
    // Execute schema
    await db.query(schemaSQL);
    
    console.log('✅ Database initialized successfully!');
    console.log('✅ Table "urls" created');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();