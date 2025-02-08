import React from 'react';
import Hero from './components/Hero';
import Demo from './components/Demo';
import Research from './components/Research';
import Testimonials from './components/Testimonials';

function App() {
  // Local state to track if dark mode is enabled
  const [darkMode, setDarkMode] = React.useState(false);

  // Whenever `darkMode` changes, add/remove the "dark" class on <html>
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      {/* 
        1) Add dark mode variants here:
           - "bg-white dark:bg-gray-900" for background color in dark mode
           - "text-gray-900 dark:text-gray-100" for text color in dark mode
           - "transition-colors" for smooth color transitions
      */}
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <nav className="fixed w-full bg-white/80 dark:bg-gray-800/60 backdrop-blur-md z-50 shadow-sm transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Logo */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  MedSegAI
                </span>
              </div>

              {/* Right: Navigation Links + Dark Mode Toggle + CTA */}
              <div className="hidden md:flex items-center gap-8">
                <a 
                  href="#demo" 
                  className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Demo
                </a>
                <a 
                  href="#research" 
                  className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Research
                </a>
                <a 
                  href="#testimonials" 
                  className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Testimonials
                </a>

                {/* Dark Mode Toggle Button */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 
                             rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 
                             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                {/* Get Started Button */}
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 
                             text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-16">
          <Hero />
          <Demo />
          <Research />
          <Testimonials />
        </main>

        <footer className="bg-gray-900 dark:bg-gray-800 text-white py-12 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">MedSegAI</h3>
                <p className="text-gray-400">
                  Advanced medical image segmentation powered by artificial intelligence.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Case Studies</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">API Reference</a></li>
                  <li><a href="#" className="hover:text-white">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 MedSegAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
