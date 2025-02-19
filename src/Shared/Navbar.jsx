import React from 'react';
import PropTypes from 'prop-types';
import { Sun, Moon } from 'lucide-react';

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="fixed w-full bg-white/80 dark:bg-gray-800/60 backdrop-blur-md z-[9999] shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              MedSegAI
            </span>
          </div>

          {/* Right: Navigation Links + Dark Mode Toggle */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="/" 
              className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </a>
            <a 
              href="/demo" 
              className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Demo
            </a>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-all duration-300 ease-in-out
                       relative overflow-hidden group"
              aria-label="Toggle theme"
            >
              <div className="relative w-6 h-6">
                <Sun 
                  className={`w-6 h-6 text-yellow-500 absolute 
                    transition-all duration-300 ease-in-out
                    ${darkMode ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                />
                <Moon 
                  className={`w-6 h-6 text-blue-400 absolute 
                    transition-all duration-300 ease-in-out
                    ${darkMode ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired
};

export default Navbar;