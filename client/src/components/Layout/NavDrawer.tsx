import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ open, onClose }) => (
  <Drawer anchor="left" open={open} onClose={onClose}>
    <List sx={{ width: 250 }}>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/" onClick={onClose}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/add" onClick={onClose}>
          <ListItemText primary="Add Leftover" />
        </ListItemButton>
      </ListItem>
      {/* Add more navigation items as needed */}
    </List>
  </Drawer>
);

export default NavDrawer;
