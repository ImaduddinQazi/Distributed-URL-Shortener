import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Short links,
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            big impact
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create powerful short links with built-in analytics and lightning-fast Redis caching.
          Built for developers, designed for everyone.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/shorten"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/analytics"
            className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:border-gray-400 transition"
          >
            View Analytics
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto pt-8 border-t border-gray-200">
          <Stat value="<10ms" label="Avg redirect" />
          <Stat value="Redis" label="Powered cache" />
          <Stat value="100%" label="Uptime" />
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default HomePage;