import { Box, Typography, Button, Stack } from '@mui/material';
import React from 'react';
import { EditOutlined as EditIcon, Delete as DeleteIcon, CheckCircle as ConsumeIcon, RestaurantMenu as EatPortionIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

type DetailActionsProps = {
  leftoverId: string;
  onEdit: () => void;
  onConsumePortion: () => void;
  onConsumeAll: () => void;
  onDelete: () => void;
};

export const DetailActions: React.FC<DetailActionsProps> = ({ leftoverId, onEdit, onConsumePortion, onConsumeAll, onDelete }) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
    <Box sx={{ flex: 1 }}>
      <Button
        startIcon={<EditIcon />}
        variant="outlined"
        component={RouterLink}
        to={`/edit/${leftoverId}`}
        fullWidth
        onClick={onEdit}
      >
        Edit
      </Button>
    </Box>
    <Box sx={{ flex: 1 }}>
      <Button
        startIcon={<EatPortionIcon />}
        variant="outlined"
        color="primary"
        onClick={onConsumePortion}
        fullWidth
      >
        Consume Portion
      </Button>
    </Box>
    <Box sx={{ flex: 1 }}>
      <Button
        startIcon={<ConsumeIcon />}
        variant="contained"
        color="primary"
        onClick={onConsumeAll}
        fullWidth
      >
        Consume All
      </Button>
    </Box>
    <Box sx={{ flex: 1 }}>
      <Button
        startIcon={<DeleteIcon />}
        variant="contained"
        color="error"
        onClick={onDelete}
        fullWidth
      >
        Delete
      </Button>
    </Box>
  </Stack>
);
