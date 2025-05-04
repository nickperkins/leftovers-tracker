import { useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme, commonTheme } from '../lib/themeConfig';
import { ColorModeContext, ThemeMode } from '../contexts/ColorModeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Material UI theme provider with automatic dark/light mode switching
 * Features:
 * - System preference detection
 * - User preference persistence in localStorage
 * - Context-based theme switching API
 */
export function ThemeProviderWrapper({ children }: ThemeProviderProps) {
  // Initialize theme from system preference or saved user preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode === 'light' || savedMode === 'dark') 
      ? (savedMode as ThemeMode) 
      : prefersDarkMode ? 'dark' : 'light';
  });

  // Persist user theme preference across sessions
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  // Create stable theme context API to avoid unnecessary re-renders
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // Generate optimized MUI theme configuration based on current mode
  // Memoized to prevent unnecessary theme regeneration
  const theme = useMemo(
    () => {
      const currentPalette = mode === 'light' ? lightTheme : darkTheme;
      
      return createTheme({
        palette: {
          mode,
          primary: {
            main: currentPalette.primary,
          },
          secondary: {
            main: currentPalette.secondary,
          },
          background: {
            default: currentPalette.background,
            paper: currentPalette.paper,
          },
          text: {
            primary: currentPalette.text.primary,
            secondary: currentPalette.text.secondary,
          },
          divider: currentPalette.divider,
        },
        typography: {
          fontFamily: commonTheme.fontFamily,
          ...commonTheme.typography,
        },
        shape: {
          borderRadius: parseInt(commonTheme.borderRadius) || 8,
        },
        // Remove default shadows from components for cleaner UI
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      });
    },
    [mode]
  );

  // Provide theme context throughout the app with Material UI's ThemeProvider
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalize CSS and apply base theme styles */}
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}