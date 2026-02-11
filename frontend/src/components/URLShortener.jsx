import { useState } from 'react';
import { shortenURL } from '../services/api';
import { copyToClipboard, isValidURL } from '../utils/helpers';

function URLShortener({ onURLCreated }) {
  const [longUrl, setLongUrl] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);

    // Validation
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidURL(longUrl)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);

    const response = await shortenURL(
      longUrl, 
      expiresIn ? parseInt(expiresIn) : null
    );

    setLoading(false);

    if (response.success) {
      setResult(response.data);
      setLongUrl('');
      setExpiresIn('');
      
      // Notify parent component
      if (onURLCreated) {
        onURLCreated(response.data.short_code);
      }
    } else {
      setError(response.error);
    }
  };

  const handleCopy = async () => {
    if (result?.short_url) {
      const success = await copyToClipboard(result.short_url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Shorten Your URL
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Long URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Long URL
          </label>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Optional Expiry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expires In (seconds) - Optional
          </label>
          <input
            type="number"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            placeholder="3600 (1 hour)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-3">✓ URL Shortened!</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={result.short_url}
                readOnly
                className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg text-sm"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              <p>Short Code: <span className="font-mono font-semibold">{result.short_code}</span></p>
              {result.expires_at && (
                <p>Expires: {new Date(result.expires_at).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default URLShortener;