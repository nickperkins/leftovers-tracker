import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface TopNavBarProps {
  onMenuClick: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onMenuClick }) => (
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Leftovers Tracker
      </Typography>
    </Toolbar>
  </AppBar>
);

export default TopNavBar;
