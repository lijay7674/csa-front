import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ThemeName } from '@csa/shared';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'sunset', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem('csa-theme') as ThemeName) || 'sunset';
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('csa-theme', t);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
