import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';
import React from 'react';

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  confirmLabel?: string;
  confirmColor?: 'primary' | 'error';
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, title, content, onCancel, onConfirm, loading, confirmLabel = 'Confirm', confirmColor = 'primary' }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm} color={confirmColor} variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);
