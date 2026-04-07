import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme-mode');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update HTML class and localStorage when theme changes
    const htmlElement = document.documentElement;
    const root = document.querySelector(':root');
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      root?.style.setProperty('--transition-duration', '500ms');
    } else {
      htmlElement.classList.remove('dark');
      root?.style.setProperty('--transition-duration', '500ms');
    }
    
    localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

