-- Create click_logs table to track individual clicks
CREATE TABLE IF NOT EXISTS click_logs (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) NOT NULL,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (short_code) REFERENCES urls(short_code) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_click_logs_short_code ON click_logs(short_code);
CREATE INDEX IF NOT EXISTS idx_click_logs_clicked_at ON click_logs(clicked_at);