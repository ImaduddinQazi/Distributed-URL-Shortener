const db = require('./database');
const fs = require('fs');
const path = require('path');

async function migrateClickLogs() {
  try {
    console.log('📦 Adding click_logs table...');
    
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'add-click-logs.sql'),
      'utf-8'
    );
    
    await db.query(migrationSQL);
    
    console.log('✅ click_logs table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migration:', error);
    process.exit(1);
  }
}

migrateClickLogs();