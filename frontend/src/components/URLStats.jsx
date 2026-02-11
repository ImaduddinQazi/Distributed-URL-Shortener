import { useState } from 'react';
import { getURLStats } from '../services/api';
import { formatDate } from '../utils/helpers';

function URLStats({ initialShortCode = '' }) {
  const [shortCode, setShortCode] = useState(initialShortCode);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchStats = async (e) => {
    e.preventDefault();
    setError('');
    setStats(null);

    if (!shortCode.trim()) {
      setError('Please enter a short code');
      return;
    }

    setLoading(true);
    const response = await getURLStats(shortCode);
    setLoading(false);

    if (response.success) {
      setStats(response.data);
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        📊 URL Statistics
      </h2>

      <form onSubmit={handleFetchStats} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Code
          </label>
          <input
            type="text"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            placeholder="e.g., 1 or abc"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Get Statistics'}
        </button>
      </form>

      {stats && (
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-3">
          <StatRow label="Short Code" value={stats.short_code} mono />
          <StatRow label="Long URL" value={stats.long_url} link />
          <StatRow label="Clicks" value={stats.click_count} highlight />
          <StatRow label="Created" value={formatDate(stats.created_at)} />
          <StatRow 
            label="Expires" 
            value={stats.expires_at ? formatDate(stats.expires_at) : 'Never'} 
          />
          <StatRow 
            label="Cache Status" 
            value={stats.is_cached ? '✓ Cached (Fast)' : '✗ Not Cached'} 
            badge={stats.is_cached}
          />
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, mono, link, highlight, badge }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className={`text-sm ${
        mono ? 'font-mono' : ''
      } ${
        highlight ? 'font-bold text-purple-700 text-lg' : ''
      } ${
        badge ? (value.includes('✓') ? 'text-green-600 font-semibold' : 'text-gray-500') : ''
      }`}>
        {link ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate max-w-xs block"
          >
            {value.substring(0, 50)}...
          </a>
        ) : value}
      </span>
    </div>
  );
}

export default URLStats;