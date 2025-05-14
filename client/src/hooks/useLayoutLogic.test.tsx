/*
Test Plan: useLayoutLogic Hook

Objectives:
- Test layout state management (drawer, navigation, theme).
- Ensure correct response to navigation and theme actions.

Scenarios:
- Opens/closes navigation drawer.
- Changes theme and propagates to context.
- Handles navigation events and updates state.

Edge Cases:
- Invalid navigation targets.
- Theme context missing or invalid.
- Rapid toggling of drawer or theme.
*/
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from '../contexts/ColorModeContext';
import { useLayoutLogic } from './useLayoutLogic';
import type { ReactNode } from 'react';

describe('useLayoutLogic', () => {
  it('toggles drawer open/close', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useLayoutLogic(), { wrapper });
    expect(result.current.drawerOpen).toBe(false);
    act(() => result.current.toggleDrawer(true)());
    expect(result.current.drawerOpen).toBe(true);
    act(() => result.current.toggleDrawer(false)());
    expect(result.current.drawerOpen).toBe(false);
  });

  it('provides theme and colorMode context', () => {
    const colorMode = { toggleColorMode: jest.fn(), mode: 'light' as const };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
      </ColorModeContext.Provider>
    );
    const { result } = renderHook(() => useLayoutLogic(), { wrapper });
    expect(result.current.colorMode).toBe(colorMode);
    expect(result.current.theme).toBeDefined();
  });
});
