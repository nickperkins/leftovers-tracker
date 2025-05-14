import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => (
  <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
    <Typography variant="body2" color="text.secondary">
      &copy; {new Date().getFullYear()} Leftovers Tracker
    </Typography>
  </Box>
);

export default Footer;
