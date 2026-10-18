import { createContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { themes, type Theme, type ThemeMode } from '../constants/theme';

type ThemeContextValue = {
  mode: ThemeMode;
  selectedMode: ThemeMode | null;
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const deviceColorScheme = useColorScheme();
  const deviceMode: ThemeMode = deviceColorScheme === 'dark' ? 'dark' : 'light';
  const [selectedMode, setSelectedMode] = useState<ThemeMode | null>(null);
  const mode = selectedMode ?? deviceMode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      selectedMode,
      theme: themes[mode],
      toggleTheme: () => {
        setSelectedMode((currentMode) => (currentMode ?? deviceMode) === 'light' ? 'dark' : 'light');
      },
    }),
    [deviceMode, mode, selectedMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}