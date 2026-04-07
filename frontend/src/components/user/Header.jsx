import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import axiosClient from '../../axiosClient';
import { logout } from '../../services/AuthService';

const Header = () => {
  const location = useLocation();
  const { user, setUser } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      
      setLoading(true);
      try {
        const response = await axiosClient.get('/user');
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

const handleLogout = async () => {
  try {
    await logout();  // backend session destroyed
    setUser(null);   // frontend user cleared
    window.location.href = '/';  // force full reload (optional)
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-midnight-border bg-white/95 dark:bg-midnight-950/95 backdrop-blur transition-colors duration-500">
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin h-6 w-6 border-b-2 border-primary-500 rounded-full"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto flex items-center px-6 py-4">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity">
            📚 MyLibrary
          </Link>
          <nav className="ml-auto flex items-center gap-3">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/"
                className={`font-medium px-4 py-2 rounded-xl transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-card'
                }`}
              >
                Home
              </Link>
              <Link
                to="/catalogue"
                className={`font-medium px-4 py-2 rounded-xl transition-colors ${
                  location.pathname === '/catalogue' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-card'
                }`}
              >
                Catalogue
              </Link>
              <Link
                to="/book"
                className={`font-medium px-4 py-2 rounded-xl transition-colors ${
                  location.pathname === '/book' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-card'
                }`}
              >
                Book Details
              </Link>
              {user?.role === 'admin' ? (
                <Link
                  to="/admin/dashboard"
                  className={`font-medium px-4 py-2 rounded-xl transition-colors ${
                    location.pathname === '/admin/dashboard' 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-card'
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className={`font-medium px-4 py-2 rounded-xl transition-colors ${
                    location.pathname === '/dashboard' 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-card'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </motion.div>

            {/* Theme Toggle Button - Enhanced */}
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-midnight-card/50 hover:bg-slate-200 dark:hover:bg-midnight-card transition-all duration-300 ml-2 border border-transparent dark:border-midnight-border/30 hover:border-slate-300 dark:hover:border-midnight-border/50 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <motion.div
                animate={{ rotate: isDarkMode ? 360 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400 drop-shadow-md" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 drop-shadow-sm" />
                )}
              </motion.div>
            </motion.button>
          </nav>

          <div className="relative ml-5 pl-5 border-l border-slate-200 dark:border-midnight-border">
            {user ? (
              <button
                onClick={handleDropdownClick}
                className="flex items-center text-slate-700 dark:text-slate-300 font-medium px-3 py-2 hover:bg-slate-100 dark:hover:bg-midnight-card rounded-xl transition-colors"
                style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
              >
                <span className="mr-2">{user.name}</span>
                <FaCaretDown className="text-sm" />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center bg-primary-500 text-white font-semibold px-5 py-2.5 hover:bg-primary-600 rounded-xl transition-colors shadow-sm hover:shadow-md"
              >
                <span>Login</span>
              </Link>
            )}
            {showDropdown && user && (
              <motion.div
                className="absolute right-0 mt-3 w-48 bg-white dark:bg-midnight-card shadow-lg dark:shadow-glass-lg rounded-xl border border-slate-100 dark:border-midnight-border overflow-hidden z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-5 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  style={{ backgroundColor: 'transparent', borderRadius: '0' }}
                >
                  <FaSignOutAlt className="mr-3 text-lg" /> Log Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
