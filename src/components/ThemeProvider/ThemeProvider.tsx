import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
