import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <span className="text-2xl">🔗</span> */}
            <img src="/src/assets/logoF.png" alt="EdgeURL Logo" className="h-20 w-20" />
            <span className="text-xl font-semibold text-gray-900">
              EdgeURL
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <NavLink to="/shorten" active={isActive('/shorten')}>
              Shorten
            </NavLink>
            <NavLink to="/analytics" active={isActive('/analytics')}>
              Analytics
            </NavLink>
            <NavLink to="/status" active={isActive('/status')}>
              Status
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}

export default Navbar;