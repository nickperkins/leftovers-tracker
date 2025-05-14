import { Box, Typography, Chip } from '@mui/material';
import React from 'react';
import { StorageLocation } from '../types/leftover.types';
import { Kitchen as FridgeIcon, AcUnit as FreezerIcon } from '@mui/icons-material';

type DetailHeaderProps = {
  name: string;
  storageLocation: StorageLocation;
};

const getLocationIcon = (location: StorageLocation) =>
  location === 'fridge' ? <FridgeIcon /> : <FreezerIcon />;

export const DetailHeader: React.FC<DetailHeaderProps> = ({ name, storageLocation }) => (
  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography variant="h4" component="h1">
      {name}
    </Typography>
    <Chip
      size="medium"
      icon={getLocationIcon(storageLocation)}
      label={storageLocation.charAt(0).toUpperCase() + storageLocation.slice(1)}
    />
  </Box>
);
