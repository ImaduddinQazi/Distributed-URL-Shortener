import { useState } from 'react';
import { getURLStats, getClickAnalytics } from '../services/api';
import { formatDate } from '../utils/helpers';
import ClickChart from '../components/ClickChart';

function AnalyticsPage() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractShortCode = (input) => {
    const trimmed = input.trim();
    
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const url = new URL(trimmed);
        const pathParts = url.pathname.split('/').filter(Boolean);
        return pathParts[pathParts.length - 1] || '';
      } catch (error) {
        return '';
      }
    }
    
    return trimmed;
  };

  const handleFetchStats = async (e) => {
    e.preventDefault();
    setError('');
    setStats(null);
    setAnalytics(null);

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
    
    const [statsResponse, analyticsResponse] = await Promise.all([
      getURLStats(shortCode),
      getClickAnalytics(shortCode)
    ]);
    
    setLoading(false);

    if (statsResponse.success) {
      setStats(statsResponse.data);
    } else {
      setError(statsResponse.error);
    }
    
    if (analyticsResponse.success) {
      setAnalytics(analyticsResponse.data);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-300">
            View detailed statistics and insights for any shortened URL
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
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
                  placeholder="e.g., 1, abc, or https://edgeurl.onrender.com/abc"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Paste either the short code or the complete shortened URL
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
                className="w-full bg-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Get Analytics'}
              </button>
            </form>
          </div>
        </div>

        {/* Results - 2 Column Layout */}
        {stats && (
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* LEFT COLUMN - Stats & QR */}
            <div className="lg:col-span-1 space-y-6">
              {/* Clicks Card */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200">
                <div className="text-sm text-gray-600 mb-2">Total Clicks</div>
                <div className="text-5xl font-bold text-gray-900 mb-4">
                  {stats.click_count}
                </div>
                <div className="text-xs text-gray-500">
                  Since {new Date(stats.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* QR Code */}
              {stats.qr_code && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                  <h4 className="font-medium text-gray-900 mb-4">QR Code</h4>
                  <img 
                    src={stats.qr_code} 
                    alt="QR Code" 
                    className="w-full max-w-[200px] mx-auto border-2 border-gray-200 rounded-lg mb-4"
                  />
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = stats.qr_code;
                      link.download = `qr-${stats.short_code}.png`;
                      link.click();
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                  >
                    Download QR
                  </button>
                </div>
              )}

              {/* Details */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-3">
                <InfoRow label="Short Code" value={stats.short_code} mono />
                <InfoRow 
                  label="Cache" 
                  value={stats.is_cached ? 'Cached ⚡' : 'Not Cached'} 
                  highlight={stats.is_cached}
                />
                <InfoRow label="Created" value={formatDate(stats.created_at)} />
                <InfoRow 
                  label="Expires" 
                  value={stats.expires_at ? formatDate(stats.expires_at) : 'Never'} 
                />
              </div>

              {/* Original URL */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  ORIGINAL URL
                </div>
                <a
                  href={stats.long_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:underline break-all"
                >
                  {stats.long_url}
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {analytics && (
                <>
                  {/* <ClickChart
                    data={analytics.clicks_by_hour}
                    title="Clicks in Last 24 Hours"
                    timeRange="hour"
                  /> */}
                  <ClickChart
                    data={analytics.clicks_by_day}
                    title="Clicks in Last 30 Days"
                    timeRange="day"
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono, highlight }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-mono' : ''} ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

export default AnalyticsPage;