import { Box, Button, CircularProgress } from '@mui/material';
import React from 'react';

type FormActionButtonsProps = {
  isEditing: boolean;
  isLoading: boolean;
  onCancel: () => void;
};

export const FormActionButtons: React.FC<FormActionButtonsProps> = ({ isEditing, isLoading, onCancel }) => (
  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
    <Button
      type="submit"
      variant="contained"
      disabled={isLoading}
      fullWidth
    >
      {isLoading ? <CircularProgress size={24} /> : (isEditing ? 'Update' : 'Save')}
    </Button>
    <Button
      variant="outlined"
      onClick={onCancel}
      fullWidth
    >
      Cancel
    </Button>
  </Box>
);
