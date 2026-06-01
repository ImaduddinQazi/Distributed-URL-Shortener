import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Short links,
              <br />
              <span className="text-blue-400">big impact</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Create powerful short links with built-in analytics and lightning-fast Redis caching.
              Built for developers, designed for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shorten"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
              <Link
                to="/analytics"
                className="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose ShortFast?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              // icon="⚡"
              title="Lightning Fast"
              description="Redis caching ensures sub-millisecond redirects for all your links"
            />
            <FeatureCard 
              // icon="📊"
              title="Real-time Analytics"
              description="Track clicks with detailed charts and insights in real-time"
            />
            <FeatureCard 
              // icon="📱"
              title="QR Codes"
              description="Auto-generated QR codes for every shortened URL"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <StatCard value="<10ms" label="Avg redirect time" />
            <StatCard value="Redis" label="Powered cache" />
            <StatCard value="99.9%" label="Uptime" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold text-xl mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

export default HomePage;