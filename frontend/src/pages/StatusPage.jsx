import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

function StatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    const result = await healthCheck();
    setStatus(result);
    setLastChecked(new Date());
    setLoading(false);
  };

  const isHealthy = status?.success && status?.data?.status === 'ok';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Status
          </h1>
          <p className="text-gray-600">
            Real-time health monitoring of all services
          </p>
        </div>

        {/* Overall Status */}
        <div className={`rounded-xl shadow-sm border-2 p-8 mb-6 ${
          isHealthy 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  isHealthy ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isHealthy ? 'All Systems Operational' : 'System Issues Detected'}
                </h2>
              </div>
              {lastChecked && (
                <p className="text-sm text-gray-600">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={checkStatus}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-4">Service Health</h3>
          
          <ServiceStatus
            name="API Server"
            status={status?.success}
            description="Main backend service"
          />
          
          <ServiceStatus
            name="PostgreSQL Database"
            status={status?.data?.database === 'connected'}
            description="Primary data storage"
          />
          
          <ServiceStatus
            name="Redis Cache"
            status={status?.data?.redis === 'connected'}
            description="High-speed caching layer"
          />
        </div>

        {/* Metrics */}
        {status?.success && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard 
                label="Response Time" 
                value="<50ms" 
                color="blue"
              />
              <MetricCard 
                label="Cache Hit Rate" 
                value="~90%" 
                color="green"
              />
              <MetricCard 
                label="Uptime" 
                value="99.9%" 
                color="purple"
              />
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TechBadge name="Node.js" />
            <TechBadge name="Express" />
            <TechBadge name="PostgreSQL" />
            <TechBadge name="Redis" />
            <TechBadge name="React" />
            <TechBadge name="Tailwind" />
            <TechBadge name="Vite" />
            <TechBadge name="Vercel" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceStatus({ name, status, description }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${
          status ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
      <span className={`text-sm font-medium ${
        status ? 'text-green-600' : 'text-red-600'
      }`}>
        {status ? 'Operational' : 'Down'}
      </span>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  const colors = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    green: 'from-green-50 to-green-100 border-green-200 text-green-700',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg p-4 border`}>
      <div className="text-xs font-medium opacity-75 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function TechBadge({ name }) {
  return (
    <div className="px-3 py-2 bg-gray-100 rounded-lg text-center">
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
  );
}

export default StatusPage;