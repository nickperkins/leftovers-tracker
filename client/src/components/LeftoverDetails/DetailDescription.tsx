import { Typography, Divider } from '@mui/material';
import React from 'react';

type DetailDescriptionProps = {
  description?: string;
};

export const DetailDescription: React.FC<DetailDescriptionProps> = ({ description }) => (
  description ? (
    <>
      <Typography variant="h6" gutterBottom>Description</Typography>
      <Typography paragraph>{description}</Typography>
      <Divider sx={{ my: 2 }} />
    </>
  ) : null
);
