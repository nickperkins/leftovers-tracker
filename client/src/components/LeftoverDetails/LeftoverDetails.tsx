import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Warning as WarningIcon
} from '@mui/icons-material';
import { useLeftoverDetailsLogic } from 'hooks/useLeftoverDetailsLogic';
import { Leftover } from '../types/leftover.types';
import { DetailHeader } from './DetailHeader';
import { DetailDescription } from './DetailDescription';
import { DetailMeta } from './DetailMeta';
import TagList from '../TagList';
import { DetailActions } from './DetailActions';
import { ConfirmationDialog } from './ConfirmationDialog';

const formatDate = (dateString: string) => {
  try {
    // Convert timestamp string to number and create Date object
    const date = new Date(Number(dateString));
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const getExpiryStatus = (expiryDate: string) => {
  const today = new Date();
  const expiry = parseISO(expiryDate);
  const daysLeft = differenceInDays(expiry, today);

  if (daysLeft < 0) {
    return { color: 'error', label: `Expired ${Math.abs(daysLeft)} days ago`, warning: true };
  } else if (daysLeft < 2) {
    return { color: 'warning', label: `Expiring soon (${daysLeft} days left)`, warning: true };
  } else {
    return { color: 'success', label: `${daysLeft} days until expiry`, warning: false };
  }
};

const LeftoverDetails = () => {
  const {
    loading,
    error,
    data,
    deleteDialogOpen,
    setDeleteDialogOpen,
    consumeDialogOpen,
    setConsumeDialogOpen,
    consumePortionDialogOpen,
    setConsumePortionDialogOpen,
    portionAmount,
    setPortionAmount,
    deleteLoading,
    consumeLoading,
    consumePortionLoading,
    handleDelete,
    handleConsume,
    handleConsumePortion,
  } = useLeftoverDetailsLogic();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading leftover: {error.message}</Alert>;
  }

  const leftover: Leftover = data?.leftover;

  if (!leftover) {
    return <Alert severity="warning">Leftover not found</Alert>;
  }

  const expiryStatus = getExpiryStatus(leftover.expiryDate);

  // Generate options for portion consumption - steps of 0.5
  const getPortionOptions = (maxPortion: number) => {
    const options = [];
    for (let i = 0.5; i <= maxPortion; i += 0.5) {
      options.push(i);
    }
    return options;
  };

  return (
    <Container maxWidth="md">
      <DetailHeader name={leftover.name} storageLocation={leftover.storageLocation} />

      {leftover.consumed ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          This item was consumed
          {leftover.consumedDate && ` on ${formatDate(leftover.consumedDate)}`}
        </Alert>
      ) : (
        expiryStatus.warning && (
          <Alert
            severity={expiryStatus.color === 'error' ? 'error' : 'warning'}
            icon={<WarningIcon />}
            sx={{ mb: 3 }}
          >
            {expiryStatus.label}
          </Alert>
        )
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <DetailDescription description={leftover.description ?? undefined} />
        <DetailMeta
          portion={leftover.portion}
          storageLocation={leftover.storageLocation}
          storedDate={leftover.storedDate}
          expiryDate={leftover.expiryDate}
          formatDate={formatDate}
        />
        {leftover.tags && leftover.tags.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Tags</Typography>
            <TagList tags={leftover.tags} onDelete={() => {}} />
          </Box>
        )}
      </Paper>

      {!leftover.consumed && (
        <DetailActions
          leftoverId={leftover.id}
          onEdit={() => {}}
          onConsumePortion={() => setConsumePortionDialogOpen(true)}
          onConsumeAll={() => setConsumeDialogOpen(true)}
          onDelete={() => setDeleteDialogOpen(true)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Confirm Deletion"
        content={`Are you sure you want to delete "${leftover.name}"? This action cannot be undone.`}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        confirmLabel="Delete"
        confirmColor="error"
      />

      {/* Consume Confirmation Dialog */}
      <ConfirmationDialog
        open={consumeDialogOpen}
        title="Consume All"
        content={`Are you sure you want to mark all portions of "${leftover.name}" as consumed?`}
        onCancel={() => setConsumeDialogOpen(false)}
        onConfirm={handleConsume}
        loading={consumeLoading}
        confirmLabel="Confirm"
        confirmColor="primary"
      />

      {/* Consume Portion Dialog */}
      <Dialog
        open={consumePortionDialogOpen}
        onClose={() => setConsumePortionDialogOpen(false)}
      >
        <DialogTitle>Consume Portion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select how much of "{leftover.name}" you want to consume:
          </DialogContentText>
          <TextField
            label="Portion Amount"
            select
            fullWidth
            value={portionAmount}
            onChange={(e) => setPortionAmount(parseFloat(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">portion{portionAmount !== 1 ? 's' : ''}</InputAdornment>,
            }}
          >
            {getPortionOptions(leftover.portion).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {leftover.portion - portionAmount === 0 ? (
              <span>This will mark the item as fully consumed.</span>
            ) : (
              <span>This will leave {(leftover.portion - portionAmount).toFixed(1)} portion(s) remaining.</span>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConsumePortionDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConsumePortion}
            color="primary"
            variant="contained"
            disabled={consumePortionLoading || portionAmount <= 0}
          >
            {consumePortionLoading ? <CircularProgress size={24} /> : 'Consume'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeftoverDetails;