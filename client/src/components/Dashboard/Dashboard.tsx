import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useDashboardLogic } from 'hooks/useDashboardLogic';
import LeftoverCard from './LeftoverCard';
import ConsumedLeftoverCard from './ConsumedLeftoverCard';
import LeftoverSearchBar from './LeftoverSearchBar';

const Dashboard = () => {
  const {
    loading,
    error,
    filteredLeftovers,
    searchTerm,
    setSearchTerm,
    locationParam,
  } = useDashboardLogic();

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

      <LeftoverSearchBar value={searchTerm} onChange={setSearchTerm} />

      {filteredLeftovers.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No leftovers found. Add some leftovers to start tracking!
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          {filteredLeftovers
            .filter(item => !item.consumed)
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
                <LeftoverCard leftover={leftover} onSelect={() => { window.location.href = `/details/${leftover.id}`; }} />
              </Box>
            ))}
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
                  <ConsumedLeftoverCard leftover={leftover} onRestore={() => {}} />
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;