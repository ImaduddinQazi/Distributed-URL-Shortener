const logCache = (short_code, hit) => {
  const status = hit ? '✅ HIT' : '❌ MISS';
  const emoji = hit ? '⚡' : '🐌';
  console.log(`${emoji} Cache ${status}: ${short_code}`);
};

const logError = (context, error) => {
  console.error(`❌ [${context}]:`, error.message);
};

const logInfo = (message) => {
  console.log(`ℹ️  ${message}`);
};

module.exports = { logCache, logError, logInfo };