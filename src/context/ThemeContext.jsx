import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const DARK_KEY = 'theme';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem(DARK_KEY) === 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem(DARK_KEY, 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem(DARK_KEY, 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);