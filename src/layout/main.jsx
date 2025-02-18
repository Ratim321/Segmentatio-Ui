import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";
import { useTheme } from "../context/ThemeContext";

export default function Main() {
  const { darkMode, setDarkMode } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`flex-grow ${!isHomePage ? "pt-16" : ""}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
