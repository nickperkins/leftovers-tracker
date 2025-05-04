import { createContext } from 'react';

// Type definitions
export type ThemeMode = 'light' | 'dark';

export interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: ThemeMode;
}

// Create and export the context
export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});