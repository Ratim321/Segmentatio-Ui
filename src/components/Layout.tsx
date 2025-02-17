import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function Layout({ darkMode, setDarkMode }: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`flex-grow ${!isHomePage ? 'pt-16' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}