import {
  Container,
  Typography,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { useLeftoverFormLogic } from 'hooks/useLeftoverFormLogic';
import { TagInput } from './TagInput';
import TagList from '../TagList';
import { PortionInput } from './PortionInput';
import { StorageSelector } from './StorageSelector';
import { ExpiryDatePicker } from './ExpiryDatePicker';
import { FormActionButtons } from './FormActionButtons';

const LeftoverForm = () => {
  const {
    isEditing,
    name,
    setName,
    description,
    setDescription,
    portion,
    setPortion,
    storageLocation,
    setStorageLocation,
    expiryDate,
    setExpiryDate,
    tags,
    currentTag,
    setCurrentTag,
    error,
    fetchLoading,
    fetchError,
    handleAddTag,
    handleRemoveTag,
    handleSubmit,
    isLoading,
    navigate,
  } = useLeftoverFormLogic();

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return <Alert severity="error">Error loading leftover: {fetchError.message}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Edit Leftover' : 'Add New Leftover'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <PortionInput portion={portion} setPortion={setPortion} />

          <StorageSelector storageLocation={storageLocation} setStorageLocation={setStorageLocation} />

          <ExpiryDatePicker expiryDate={expiryDate} setExpiryDate={setExpiryDate} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Tags</Typography>
            <TagInput currentTag={currentTag} setCurrentTag={setCurrentTag} onAddTag={handleAddTag} />
            <TagList tags={tags} onDelete={handleRemoveTag} />
          </Box>

          <FormActionButtons isEditing={isEditing} isLoading={isLoading} onCancel={() => navigate(-1)} />
        </Box>
      </Paper>
    </Container>
  );
};

export default LeftoverForm;