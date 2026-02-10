-- Drop table if exists (for development)
DROP TABLE IF EXISTS urls;

-- Create urls table
CREATE TABLE urls (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  click_count INTEGER DEFAULT 0
);

-- Create index on short_code for fast lookups
CREATE INDEX idx_short_code ON urls(short_code);

-- Create index on created_at for analytics
CREATE INDEX idx_created_at ON urls(created_at);