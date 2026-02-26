function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              {/* <span className="text-2xl">🔗</span> */}
              <img src="/src/assets/logoF.png" alt="EdgeURL Logo" className="h-20 w-20" />
              <span className="text-xl font-semibold text-white">
                EdgeURL
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              A production-ready URL shortener built with Node.js, React, PostgreSQL, and Redis. 
              Featuring instant redirects, QR code generation, and real-time analytics.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://github.com" icon="GitHub" />
              <SocialLink href="https://linkedin.com" icon="LinkedIn" />
              <SocialLink href="https://twitter.com" icon="Twitter" />
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">URL Shortening</a></li>
              <li><a href="#" className="hover:text-white transition">QR Code Generator</a></li>
              <li><a href="#" className="hover:text-white transition">Click Analytics</a></li>
              <li><a href="#" className="hover:text-white transition">Redis Caching</a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tech Stack</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Node.js + Express</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>React + Tailwind CSS</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>PostgreSQL + Redis</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Deployed on Render</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400">
            © {new Date().getFullYear()} EdgeURL. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
    >
      <span className="text-xs">{icon[0]}</span>
    </a>
  );
}

export default Footer;