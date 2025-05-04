import { ReactNode, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Kitchen as KitchenIcon,
  AcUnit as FreezerIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { ColorModeContext } from '../contexts/ColorModeContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="All Leftovers" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/?location=fridge">
            <ListItemIcon>
              <KitchenIcon />
            </ListItemIcon>
            <ListItemText primary="In Fridge" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/?location=freezer">
            <ListItemIcon>
              <FreezerIcon />
            </ListItemIcon>
            <ListItemText primary="In Freezer" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/add">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add New Leftover" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw'
    }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
            Leftovers Tracker
          </Typography>
          {!isMobile && (
            <>
              <Button color="inherit" component={RouterLink} to="/">
                All
              </Button>
              <Button color="inherit" component={RouterLink} to="/?location=fridge">
                Fridge
              </Button>
              <Button color="inherit" component={RouterLink} to="/?location=freezer">
                Freezer
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/add"
                variant="outlined"
                sx={{ ml: 2 }}
              >
                Add New
              </Button>
            </>
          )}
          <Tooltip title={theme.palette.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme => 
            theme.palette.mode === 'light' 
              ? theme.palette.grey[200] 
              : theme.palette.grey[900]
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" align="center">
            Leftovers Tracker &copy; {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;