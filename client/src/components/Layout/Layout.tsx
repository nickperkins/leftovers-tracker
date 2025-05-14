import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { useLayoutLogic } from 'hooks/useLayoutLogic';
import TopNavBar from './TopNavBar';
import NavDrawer from './NavDrawer';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const {
    drawerOpen,
    toggleDrawer,
  } = useLayoutLogic();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw'
    }}>
      <TopNavBar onMenuClick={toggleDrawer(true)} />
      <NavDrawer open={drawerOpen} onClose={toggleDrawer(false)} />
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
      <Footer />
    </Box>
  );
};

export default Layout;