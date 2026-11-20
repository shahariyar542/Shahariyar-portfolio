import { useState, useEffect } from 'react';
import { ThemeContext } from './themeContextInstance';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('shahariyar_theme');
        if (saved === 'light' || saved === 'dark' || saved === 'gold') return saved;
      } catch {
        // Fallback to default
      }
    }
    return 'dark'; // Master default is Night Mode
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.remove('theme-dark', 'theme-light', 'theme-gold');
    root.classList.add(`theme-${theme}`);

    try {
      localStorage.setItem('shahariyar_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Smoothly cycle through all 3 modes: Dark -> Crystal Ice-Blue -> Champagne Gold -> Dark
  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'gold';
      return 'dark';
    });
  };

  const selectTheme = (targetTheme) => {
    if (['dark', 'light', 'gold'].includes(targetTheme)) {
      setTheme(targetTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        isGold: theme === 'gold',
        toggleTheme: cycleTheme,
        cycleTheme,
        selectTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
