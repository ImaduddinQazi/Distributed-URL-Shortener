import { useState } from 'react';
import { getURLStats } from '../services/api';
import { formatDate } from '../utils/helpers';

function AnalyticsPage() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract short code from input (handles both URL and plain code)
  const extractShortCode = (input) => {
    const trimmed = input.trim();
    
    // If it's a URL, extract the short code
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const url = new URL(trimmed);
        // Get the last part of the path (short code)
        const pathParts = url.pathname.split('/').filter(Boolean);
        return pathParts[pathParts.length - 1] || '';
      } catch (error) {
        return '';
      }
    }
    
    // Otherwise, treat it as a plain short code
    return trimmed;
  };

  const handleFetchStats = async (e) => {
    e.preventDefault();
    setError('');
    setStats(null);

    if (!input.trim()) {
      setError('Please enter a short code or URL');
      return;
    }

    const shortCode = extractShortCode(input);

    if (!shortCode) {
      setError('Could not extract short code from input');
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics
          </h1>
          <p className="text-gray-600">
            View detailed statistics for any shortened URL
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleFetchStats} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter short code or full URL
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 1 or http://localhost:3000/1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                You can paste either the short code (e.g., "6") or the full URL (e.g., "http://localhost:3000/6")
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Statistics'}
            </button>
          </form>

          {stats && (
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Link Performance
                </h3>
                <p className="text-sm text-gray-500">
                  Real-time analytics for your shortened URL
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                <div className="text-sm text-gray-600 mb-1">Total Clicks</div>
                <div className="text-4xl font-bold text-gray-900">
                  {stats.click_count}
                </div>
              </div>

              {stats.qr_code && (
                <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col items-center">
                  <h4 className="font-medium text-gray-900 mb-4">QR Code</h4>
                  <img
                    src={stats.qr_code}
                    alt="QR Code"
                    className="w-48 h-48 border-2 border-gray-200 rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = stats.qr_code;
                      link.download = `qr-${stats.short_code}.png`;
                      link.click();
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Download QR Code
                  </button>
                </div>
              )}

              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="Short Code" value={stats.short_code} mono />
                <InfoCard 
                  label="Cache Status" 
                  value={stats.is_cached ? 'Cached ⚡' : 'Not Cached'} 
                  highlight={stats.is_cached}
                />
                <InfoCard label="Created" value={formatDate(stats.created_at)} />
                <InfoCard 
                  label="Expires" 
                  value={stats.expires_at ? formatDate(stats.expires_at) : 'Never'} 
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  ORIGINAL URL
                </div>
                <a                
                  href={stats.long_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {stats.long_url}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, mono, highlight }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="text-xs font-medium text-gray-500 mb-1">
        {label.toUpperCase()}
      </div>
      <div className={`text-sm font-medium ${mono ? 'font-mono' : ''} ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
      </div>
    </div>
  );
}

export default AnalyticsPage;