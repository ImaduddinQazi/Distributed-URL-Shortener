import { useState } from 'react';
import { shortenURL } from '../services/api';
import { copyToClipboard, isValidURL } from '../utils/helpers';

function ShortenPage() {
  const [longUrl, setLongUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);

    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidURL(longUrl)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    const response = await shortenURL(longUrl);
    setLoading(false);

    if (response.success) {
      setResult(response.data);
      setLongUrl('');
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

  const handleDownloadQR = () => {
    if (result?.qr_code) {
      const link = document.createElement('a');
      link.href = result.qr_code;
      link.download = `qr-${result.short_code}.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shorten your link
          </h1>
          <p className="text-gray-600">
            Paste a long URL and get a short, shareable link instantly
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your long URL
              </label>
              <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {result && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Your short link
                </span>
                <span className="text-xs text-green-600 font-medium">
                  ✓ Created
                </span>
              </div>
              
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={result.short_url}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* QR Code Section */}
              {result.qr_code && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <img 
                        src={result.qr_code} 
                        alt="QR Code" 
                        className="w-40 h-40 border-4 border-white rounded-lg shadow-md"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        📱 QR Code Ready!
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Scan this QR code to access your shortened URL instantly
                      </p>
                      <button
                        onClick={handleDownloadQR}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Download QR Code
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Short code:</span>{' '}
                    <span className="font-mono">{result.short_code}</span>
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(result.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-3">Quick tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>QR codes are generated automatically for easy sharing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Links are cached with Redis for instant redirects</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Track clicks and performance in the Analytics tab</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ShortenPage;