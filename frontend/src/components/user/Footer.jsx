import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white py-14 mt-auto transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-5 flex items-center transition-colors duration-500">
            <span className="text-primary-400 mr-2">/</span> About Us
          </h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-sm transition-colors duration-500">
            We're passionate about books and community learning. Our mission is to make great reads accessible to everyone. Discover your next favorite book here.
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-5 flex items-center transition-colors duration-500">
            <span className="text-primary-400 mr-2">/</span> Quick Links
          </h4>
          <ul className="text-slate-600 dark:text-slate-300 text-sm space-y-3 transition-colors duration-500">
            <li><a href="/" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">Home</a></li>
            <li><a href="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">Login</a></li>
            <li><a href="/book" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">Book Detail</a></li>
            <li><a href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">User Dashboard</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-5 flex items-center transition-colors duration-500">
            <span className="text-primary-400 mr-2">/</span> Stay Connected
          </h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 max-w-sm transition-colors duration-500">Follow us on social media and stay updated with our latest collections and events.</p>
          <div className="flex gap-4">
            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all duration-300 shadow-sm">
              <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
            </a>
            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all duration-300 shadow-sm">
              <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
            </a>
            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all duration-300 shadow-sm">
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-slate-200 dark:border-slate-700 text-center flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">
        <p>&copy; {new Date().getFullYear()} MyLibrary. All rights reserved.</p>
        <div className="mt-4 md:mt-0 space-x-4">
          <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;