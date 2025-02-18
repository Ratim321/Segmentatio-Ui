import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Demo from './components/Demo';
import Research from './components/Research';
import Testimonials from './components/Testimonials';
import { Sun, Moon } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DemoPage from './pages/DemoPage';
import Layout from './components/Layout';
import { ImageViewer } from './components/ImageAnalysis/ImageViewer';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}>
          <Route index element={
            <>
              <Hero />
              <Research />
              <Testimonials />
            </>
          } />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/image-analysis" element={<ImageViewer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;