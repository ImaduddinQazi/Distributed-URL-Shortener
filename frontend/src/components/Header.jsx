import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

function Header() {
  const [status, setStatus] = useState({ db: false, redis: false });

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    const result = await healthCheck();
    if (result.success) {
      setStatus({
        db: result.data.database === 'connected',
        redis: result.data.redis === 'connected',
      });
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🔗 URL Shortener</h1>
            <p className="text-blue-100">
              Lightning-fast link shortening with Redis caching
            </p>
          </div>
          
          <div className="flex gap-3">
            <StatusBadge label="Database" active={status.db} />
            <StatusBadge label="Cache" active={status.redis} />
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusBadge({ label, active }) {
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
      active 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      {active ? '✓' : '✗'} {label}
    </div>
  );
}

export default Header;