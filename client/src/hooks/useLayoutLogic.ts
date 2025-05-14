import { useState, useContext } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { ColorModeContext } from '../contexts/ColorModeContext';

export function useLayoutLogic() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return {
    theme,
    colorMode,
    isMobile,
    drawerOpen,
    setDrawerOpen,
    toggleDrawer,
  };
}
