import { useState, useEffect } from 'react';
import { ThemeContext } from './themeContextInstance';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('shahariyar_theme');
        if (saved === 'light' || saved === 'dark') return saved;
      } catch {
        // Fallback to default
      }
    }
    return 'dark'; // Master default is Night Mode
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    }

    try {
      localStorage.setItem('shahariyar_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
