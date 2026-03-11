import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  // Close menu when navigating
  const handleNavClick = () => {
    setIsOpen(false);
  };
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={handleNavClick}>
            {/* <span className="text-2xl">🔗</span> */}
            <img src="/logoF.png" alt="EdgeURL Logo" className="h-20 w-20" />
            <span className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
              EdgeURL
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
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

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <MobileNavLink 
                to="/shorten" 
                active={isActive('/shorten')}
                onClick={handleNavClick}
              >
                Shorten
              </MobileNavLink>
              <MobileNavLink 
                to="/analytics" 
                active={isActive('/analytics')}
                onClick={handleNavClick}
              >
                Analytics
              </MobileNavLink>
              <MobileNavLink 
                to="/status" 
                active={isActive('/status')}
                onClick={handleNavClick}
              >
                Status
              </MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Desktop NavLink
function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-800 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

// Mobile NavLink
function MobileNavLink({ to, active, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-800 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default Navbar;