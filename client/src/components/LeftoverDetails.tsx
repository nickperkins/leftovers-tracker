import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack
} from '@mui/material';
import {
  Kitchen as FridgeIcon,
  AcUnit as FreezerIcon,
  EditOutlined as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ConsumeIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { GET_LEFTOVER, DELETE_LEFTOVER, CONSUME_LEFTOVER } from '../graphql/leftovers';
import { Leftover, StorageLocation } from '../types/leftover.types';

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

const LeftoverDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consumeDialogOpen, setConsumeDialogOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_LEFTOVER, {
    variables: { id },
    fetchPolicy: 'cache-and-network'
  });

  const [deleteLeftover, { loading: deleteLoading }] = useMutation(DELETE_LEFTOVER, {
    onCompleted: () => {
      navigate('/');
    },
    onError: (error) => {
      console.error('Delete error:', error);
    }
  });

  const [consumeLeftover, { loading: consumeLoading }] = useMutation(CONSUME_LEFTOVER, {
    onCompleted: () => {
      setConsumeDialogOpen(false);
    },
    onError: (error) => {
      console.error('Consume error:', error);
    },
    refetchQueries: [{ query: GET_LEFTOVER, variables: { id } }]
  });

  const handleDelete = () => {
    if (id) {
      deleteLeftover({ variables: { id } });
    }
  };

  const handleConsume = () => {
    if (id) {
      consumeLeftover({ variables: { id } });
    }
  };

  const getLocationIcon = (location: StorageLocation) => {
    return location === 'fridge' ? <FridgeIcon /> : <FreezerIcon />;
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

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1">
          {leftover.name}
        </Typography>
        <Chip
          size="medium"
          icon={getLocationIcon(leftover.storageLocation)}
          label={leftover.storageLocation.charAt(0).toUpperCase() + leftover.storageLocation.slice(1)}
        />
      </Box>

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
        <Box>
          {leftover.description && (
            <>
              <Typography variant="h6" gutterBottom>Description</Typography>
              <Typography paragraph>{leftover.description}</Typography>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          <Stack spacing={3} sx={{ mb: 3 }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={4} 
              justifyContent="space-between"
            >
              <Box sx={{ flex: '1 1', minWidth: { xs: '100%', sm: '45%' }}}>
                <Typography variant="subtitle1" fontWeight="bold">Portion</Typography>
                <Typography>{leftover.portion}</Typography>
              </Box>

              <Box sx={{ flex: '1 1', minWidth: { xs: '100%', sm: '45%' }}}>
                <Typography variant="subtitle1" fontWeight="bold">Storage</Typography>
                <Typography>{leftover.storageLocation}</Typography>
              </Box>
            </Stack>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={4} 
              justifyContent="space-between"
            >
              <Box sx={{ flex: '1 1', minWidth: { xs: '100%', sm: '45%' }}}>
                <Typography variant="subtitle1" fontWeight="bold">Stored on</Typography>
                <Typography>{formatDate(leftover.storedDate)}</Typography>
              </Box>

              <Box sx={{ flex: '1 1', minWidth: { xs: '100%', sm: '45%' }}}>
                <Typography variant="subtitle1" fontWeight="bold">Expires on</Typography>
                <Typography>{formatDate(leftover.expiryDate)}</Typography>
              </Box>
            </Stack>
          </Stack>

          {leftover.tags && leftover.tags.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Tags</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {leftover.tags.map((tag, index) => (
                  <Chip key={index} label={tag} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
      >
        <Box sx={{ flex: 1 }}>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            component={RouterLink}
            to={`/edit/${leftover.id}`}
            fullWidth
          >
            Edit
          </Button>
        </Box>

        {!leftover.consumed && (
          <Box sx={{ flex: 1 }}>
            <Button
              startIcon={<ConsumeIcon />}
              variant="contained"
              color="primary"
              onClick={() => setConsumeDialogOpen(true)}
              fullWidth
            >
              Mark as Consumed
            </Button>
          </Box>
        )}

        <Box sx={{ flex: leftover.consumed ? 2 : 1 }}>
          <Button
            startIcon={<DeleteIcon />}
            variant="contained"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            fullWidth
          >
            Delete
          </Button>
        </Box>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{leftover.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Consume Confirmation Dialog */}
      <Dialog
        open={consumeDialogOpen}
        onClose={() => setConsumeDialogOpen(false)}
      >
        <DialogTitle>Mark as Consumed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark "{leftover.name}" as consumed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConsumeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConsume}
            color="primary"
            variant="contained"
            disabled={consumeLoading}
          >
            {consumeLoading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeftoverDetails;