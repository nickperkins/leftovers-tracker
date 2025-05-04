import { useState, useEffect } from 'react';
import * as React from 'react'; // Add explicit React import for JSX namespace
import { useQuery } from '@apollo/client';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns'; // Remove parseISO import
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Kitchen as FridgeIcon,
  AcUnit as FreezerIcon,
  WarningAmber as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { GET_LEFTOVERS } from '../graphql/leftovers';
import { Leftover, StorageLocation } from '../types/leftover.types';

type ExpiryStatus = {
  color: 'error' | 'warning' | 'success';
  label: string;
  icon: React.ReactElement | null;
};

const formatDate = (dateString: string) => {
  try {
    // Convert timestamp string to number and create Date object
    const date = new Date(Number(dateString));
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get('location') as StorageLocation | null;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeftovers, setFilteredLeftovers] = useState<Leftover[]>([]);

  const { loading, error, data } = useQuery(GET_LEFTOVERS, {
    variables: { location: locationParam },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (data?.leftovers) {
      // Filter based on search term
      setFilteredLeftovers(
        data.leftovers.filter((leftover: Leftover) =>
          leftover.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leftover.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leftover.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          leftover.ingredients?.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [data, searchTerm]);

  const getExpiryStatus = (expiryDate: string): ExpiryStatus => {
    const today = new Date();
    const expiry = new Date(Number(expiryDate));
    const daysLeft = differenceInDays(expiry, today);

    if (daysLeft < 0) {
      return { color: 'error', label: 'Expired', icon: <ErrorIcon fontSize="small" /> };
    } else if (daysLeft < 2) {
      return { color: 'warning', label: 'Expiring soon', icon: <WarningIcon fontSize="small" /> };
    } else {
      return { color: 'success', label: `${daysLeft} days left`, icon: null };
    }
  };

  const getLocationIcon = (location: StorageLocation) => {
    return location === 'fridge' ? <FridgeIcon /> : <FreezerIcon />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading leftovers: {error.message}</Alert>;
  }

  const title = locationParam
    ? `Leftovers in ${locationParam.charAt(0).toUpperCase() + locationParam.slice(1)}`
    : 'All Leftovers';

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        placeholder="Search leftovers by name, tags, or ingredients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {filteredLeftovers.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No leftovers found. Add some leftovers to start tracking!
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          {filteredLeftovers
            .filter(item => !item.consumed)
            .map(leftover => {
              const expiryStatus = getExpiryStatus(leftover.expiryDate);

              return (
                <Box key={leftover.id} sx={{ 
                  width: { 
                    xs: '100%', 
                    sm: '50%', 
                    md: '33.333%',
                    lg: '25%' 
                  }, 
                  mb: 3,
                  px: 2
                }}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="div">
                          {leftover.name}
                        </Typography>
                        <Chip
                          size="small"
                          icon={getLocationIcon(leftover.storageLocation)}
                          label={leftover.storageLocation}
                        />
                      </Box>

                      {leftover.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {leftover.description}
                        </Typography>
                      )}

                      <Box sx={{ mt: 2 }}>
                        <Chip
                          size="small"
                          color={expiryStatus.color}
                          icon={expiryStatus.icon || undefined}
                          label={expiryStatus.label}
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Stored: {formatDate(leftover.storedDate)}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Expires: {formatDate(leftover.expiryDate)}
                        </Typography>
                      </Box>

                      {leftover.tags && leftover.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {leftover.tags.map(tag => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/details/${leftover.id}`}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/edit/${leftover.id}`}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              );
            })}
        </Box>
      )}

      {filteredLeftovers.filter(item => item.consumed).length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Consumed Items
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {filteredLeftovers
              .filter(item => item.consumed)
              .map(leftover => (
                <Box key={leftover.id} sx={{ 
                  width: { 
                    xs: '100%', 
                    sm: '50%', 
                    md: '33.333%',
                    lg: '25%' 
                  }, 
                  mb: 3,
                  px: 2
                }}>
                  <Card
                    variant="outlined"
                    sx={{
                      opacity: 0.7,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="div">
                          {leftover.name}
                        </Typography>
                        <Chip
                          size="small"
                          label="Consumed"
                        />
                      </Box>

                      {leftover.consumedDate && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Consumed on: {formatDate(leftover.consumedDate)}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/details/${leftover.id}`}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;