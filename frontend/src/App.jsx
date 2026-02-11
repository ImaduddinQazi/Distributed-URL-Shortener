import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import URLShortener from './components/URLShortener';
import URLStats from './components/URLStats';

function App() {
  const [latestShortCode, setLatestShortCode] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <URLShortener onURLCreated={setLatestShortCode} />
          <URLStats initialShortCode={latestShortCode} />
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Why Choose Our URL Shortener?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon="⚡"
              title="Lightning Fast"
              description="Redis caching ensures sub-millisecond redirects"
            />
            <FeatureCard 
              icon="🔒"
              title="Secure & Reliable"
              description="PostgreSQL backed with ACID compliance"
            />
            <FeatureCard 
              icon="📊"
              title="Analytics Ready"
              description="Track clicks and monitor performance"
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>Built with Node.js, React, PostgreSQL, and Redis</p>
          <p className="text-sm mt-2 text-gray-400">
            A production-ready distributed system project
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default App;
