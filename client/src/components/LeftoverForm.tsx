import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import { CREATE_LEFTOVER, UPDATE_LEFTOVER, GET_LEFTOVER } from '../graphql/leftovers';
import { LeftoverInput, LeftoverUpdateInput } from '../types/leftover.types';

const LeftoverForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [portion, setPortion] = useState(1);
  const [storageLocation, setStorageLocation] = useState<'freezer' | 'fridge'>('fridge');
  const [expiryDate, setExpiryDate] = useState<Date>(addDays(new Date(), 3)); // Default 3 days from now
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  // If editing, fetch current leftover data
  const { loading: fetchLoading, error: fetchError, data } = useQuery(GET_LEFTOVER, {
    variables: { id },
    skip: !isEditing
  });

  // Set up mutations
  const [createLeftover, { loading: createLoading }] = useMutation(CREATE_LEFTOVER, {
    onCompleted: () => {
      navigate('/');
    },
    onError: (error) => {
      setError(`Error creating leftover: ${error.message}`);
    }
  });

  const [updateLeftover, { loading: updateLoading }] = useMutation(UPDATE_LEFTOVER, {
    onCompleted: () => {
      navigate('/');
    },
    onError: (error) => {
      setError(`Error updating leftover: ${error.message}`);
    }
  });

  // Load existing data when editing
  useEffect(() => {
    if (isEditing && data?.leftover) {
      const leftover = data.leftover;
      setName(leftover.name);
      setDescription(leftover.description || '');
      setPortion(leftover.portion);
      setStorageLocation(leftover.storageLocation);
      // Convert timestamp string to Date object
      setExpiryDate(new Date(Number(leftover.expiryDate)));
      setIngredients(leftover.ingredients || []);
      setTags(leftover.tags || []);
    }
  }, [isEditing, data]);

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      if (!name.trim()) {
        setError('Name is required');
        return;
      }

      if (portion <= 0) {
        setError('Portion must be greater than 0');
        return;
      }

      // Ensure we have a valid date
      if (!expiryDate || isNaN(expiryDate.getTime())) {
        setError('Please select a valid expiry date');
        return;
      }

      // Convert date to timestamp string
      const formattedExpiryDate = expiryDate.getTime().toString();

      // Prepare input data
      const leftoverData = {
        name: name.trim(),
        description: description.trim() || undefined,
        portion,
        storageLocation,
        expiryDate: formattedExpiryDate,
        ingredients: ingredients.length > 0 ? ingredients : undefined,
        tags: tags.length > 0 ? tags : undefined
      };

      // Submit data based on whether we're creating or updating
      if (isEditing) {
        updateLeftover({
          variables: {
            id,
            leftoverInput: leftoverData as LeftoverUpdateInput
          }
        });
      } else {
        createLeftover({
          variables: {
            leftoverInput: leftoverData as LeftoverInput
          }
        });
      }
    } catch (error) {
      setError(`An error occurred: ${error}`);
    }
  };

  const isLoading = fetchLoading || createLoading || updateLoading;

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

          <TextField
            label="Portion"
            type="number"
            fullWidth
            margin="normal"
            value={portion}
            onChange={(e) => setPortion(parseFloat(e.target.value))}
            inputProps={{ min: 0.5, step: 0.5 }}
            required
          />

          <FormControl margin="normal" fullWidth>
            <FormLabel>Storage Location</FormLabel>
            <RadioGroup
              row
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value as 'freezer' | 'fridge')}
            >
              <FormControlLabel value="fridge" control={<Radio />} label="Fridge" />
              <FormControlLabel value="freezer" control={<Radio />} label="Freezer" />
            </RadioGroup>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Expiry Date"
              value={expiryDate}
              onChange={(newValue) => newValue && setExpiryDate(newValue)}
              sx={{ mt: 2, width: '100%' }}
            />
          </LocalizationProvider>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Ingredients</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Add Ingredient"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                fullWidth
              />
              <Button onClick={handleAddIngredient} variant="outlined">Add</Button>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              {ingredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={ingredient}
                  onDelete={() => handleRemoveIngredient(index)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Tags</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Add Tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                fullWidth
              />
              <Button onClick={handleAddTag} variant="outlined">Add</Button>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(index)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>

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
              onClick={() => navigate(-1)}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LeftoverForm;