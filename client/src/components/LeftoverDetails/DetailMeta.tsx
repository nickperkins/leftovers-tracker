import { Box, Typography, Stack } from '@mui/material';
import React from 'react';

type DetailMetaProps = {
  portion: number;
  storageLocation: string;
  storedDate: string;
  expiryDate: string;
  formatDate: (date: string) => string;
};

export const DetailMeta: React.FC<DetailMetaProps> = ({ portion, storageLocation, storedDate, expiryDate, formatDate }) => (
  <Stack spacing={3} sx={{ mb: 3 }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-between">
      <Box sx={{ flex: '1 1', minWidth: { xs: '100%', sm: '45%' }}}>
        <Typography variant="subtitle1" fontWeight="bold">Portion</Typography>
        <Typography>{portion}</Typography>
      </Box>
      <Box sx={{ flex: '1 1', minWidth: { xs: '100%', sm: '45%' }}}>
        <Typography variant="subtitle1" fontWeight="bold">Storage</Typography>
        <Typography>{storageLocation}</Typography>
      </Box>
    </Stack>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-between">
      <Box sx={{ flex: '1 1', minWidth: { xs: '100%', sm: '45%' }}}>
        <Typography variant="subtitle1" fontWeight="bold">Stored on</Typography>
        <Typography>{formatDate(storedDate)}</Typography>
      </Box>
      <Box sx={{ flex: '1 1', minWidth: { xs: '100%', sm: '45%' }}}>
        <Typography variant="subtitle1" fontWeight="bold">Expires on</Typography>
        <Typography>{formatDate(expiryDate)}</Typography>
      </Box>
    </Stack>
  </Stack>
);
