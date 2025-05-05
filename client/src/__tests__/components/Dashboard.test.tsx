import { jest } from '@jest/globals';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import Dashboard from '../../components/Dashboard';
import { GET_LEFTOVERS } from '../../graphql/leftovers';
import { addDays, subDays } from 'date-fns';
import { StorageLocation } from '../../types/leftover.types';

// Mock current date for consistent testing
const mockDate = new Date('2025-01-15');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as Date);

describe('Dashboard Component', () => {
  // Helper function to render the component with mocks
  const renderComponent = (
    mocks: MockedResponse[] = [],
    initialEntries: string[] = ['/']
  ) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/details/:id" element={<Dashboard />} />
            <Route path="/edit/:id" element={<Dashboard />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );
  };

  // Mock data for tests
  const createMockLeftovers = () => {
    const todayTimestamp = mockDate.getTime().toString();
    const tomorrow = addDays(mockDate, 1);
    const nextWeek = addDays(mockDate, 7);
    const yesterday = subDays(mockDate, 1);

    return [
      {
        id: '1',
        name: 'Fresh Pasta',
        description: 'Leftover spaghetti with marinara sauce',
        portion: 2,
        storageLocation: 'fridge' as StorageLocation,
        storedDate: todayTimestamp,
        expiryDate: nextWeek.getTime().toString(),
        tags: ['pasta', 'italian'],
        consumed: false,
        consumedDate: null,
        createdAt: todayTimestamp,
        updatedAt: todayTimestamp
      },
      {
        id: '2',
        name: 'Frozen Pizza',
        description: 'Half pepperoni pizza',
        portion: 1,
        storageLocation: 'freezer' as StorageLocation,
        storedDate: todayTimestamp,
        expiryDate: nextWeek.getTime().toString(),
        tags: ['pizza'],
        consumed: false,
        consumedDate: null,
        createdAt: todayTimestamp,
        updatedAt: todayTimestamp
      },
      {
        id: '3',
        name: 'Expired Salad',
        description: 'Caesar salad with croutons',
        portion: 1,
        storageLocation: 'fridge' as StorageLocation,
        storedDate: yesterday.getTime().toString(),
        expiryDate: yesterday.getTime().toString(),
        tags: ['salad', 'expired'],
        consumed: false,
        consumedDate: null,
        createdAt: yesterday.getTime().toString(),
        updatedAt: yesterday.getTime().toString()
      },
      {
        id: '4',
        name: 'Almost Expired Soup',
        description: 'Chicken noodle soup',
        portion: 1.5,
        storageLocation: 'fridge' as StorageLocation,
        storedDate: yesterday.getTime().toString(),
        expiryDate: tomorrow.getTime().toString(),
        tags: ['soup'],
        consumed: false,
        consumedDate: null,
        createdAt: yesterday.getTime().toString(),
        updatedAt: yesterday.getTime().toString()
      },
      {
        id: '5',
        name: 'Consumed Lasagna',
        description: 'Beef lasagna',
        portion: 0,
        storageLocation: 'fridge' as StorageLocation,
        storedDate: yesterday.getTime().toString(),
        expiryDate: nextWeek.getTime().toString(),
        tags: ['pasta', 'italian'],
        consumed: true,
        consumedDate: todayTimestamp,
        createdAt: yesterday.getTime().toString(),
        updatedAt: todayTimestamp
      }
    ];
  };

  // Tests
  it('displays loading state initially', () => {
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: null }
        },
        result: {
          data: {
            leftovers: createMockLeftovers()
          }
        },
        delay: 100 // Add delay to see loading state
      }
    ];

    renderComponent(mocks);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('displays all leftovers when no location filter is applied', async () => {
    const mockLeftovers = createMockLeftovers();
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: null }
        },
        result: {
          data: {
            leftovers: mockLeftovers
          }
        }
      }
    ];

    renderComponent(mocks);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-title')).toHaveTextContent('All Leftovers');
    });

    // Check for active leftovers (not consumed)
    expect(screen.getByTestId('leftover-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('leftover-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('leftover-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('leftover-card-4')).toBeInTheDocument();

    // Check for consumed section
    expect(screen.getByTestId('consumed-items-title')).toBeInTheDocument();
    expect(screen.getByTestId('consumed-card-5')).toBeInTheDocument();
  });

  it('filters leftovers by fridge location', async () => {
    const mockLeftovers = createMockLeftovers();
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: 'fridge' }
        },
        result: {
          data: {
            leftovers: mockLeftovers.filter(l => l.storageLocation === 'fridge')
          }
        }
      }
    ];

    renderComponent(mocks, ['/?location=fridge']);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-title')).toHaveTextContent('Leftovers in Fridge');
    });

    // Should show fridge items
    expect(screen.getByTestId('leftover-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('leftover-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('leftover-card-4')).toBeInTheDocument();

    // Should not show freezer items
    expect(screen.queryByTestId('leftover-card-2')).not.toBeInTheDocument();
  });

  it('filters leftovers by freezer location', async () => {
    const mockLeftovers = createMockLeftovers();
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: 'freezer' }
        },
        result: {
          data: {
            leftovers: mockLeftovers.filter(l => l.storageLocation === 'freezer')
          }
        }
      }
    ];

    renderComponent(mocks, ['/?location=freezer']);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-title')).toHaveTextContent('Leftovers in Freezer');
    });

    // Should show freezer items
    expect(screen.getByTestId('leftover-card-2')).toBeInTheDocument();

    // Should not show fridge items
    expect(screen.queryByTestId('leftover-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('leftover-card-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('leftover-card-4')).not.toBeInTheDocument();
  });

  it('displays correct expiry statuses based on expiry dates', async () => {
    const mockLeftovers = createMockLeftovers();
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: null }
        },
        result: {
          data: {
            leftovers: mockLeftovers
          }
        }
      }
    ];

    renderComponent(mocks);

    await waitFor(() => {
      // Item with far future expiry date
      expect(screen.getByTestId('leftover-expiry-1')).toHaveTextContent('7 days left');

      // Item with expired date
      expect(screen.getByTestId('leftover-expiry-3')).toHaveTextContent('Expired');

      // Item expiring soon (within 1 day)
      expect(screen.getByTestId('leftover-expiry-4')).toHaveTextContent('Expiring soon');
    });
  });

  it('filters leftovers by search term', async () => {
    const mockLeftovers = createMockLeftovers();
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: null }
        },
        result: {
          data: {
            leftovers: mockLeftovers
          }
        }
      }
    ];

    renderComponent(mocks);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    // Initially all items are displayed
    expect(screen.getByTestId('leftover-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('leftover-card-2')).toBeInTheDocument();

    // Search for 'pasta'
    const searchInput = screen.getByTestId('search-input').querySelector('input');
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'pasta' } });
    }

    // Should now only show items with 'pasta' in name, description or tags
    await waitFor(() => {
      expect(screen.getByTestId('leftover-card-1')).toBeInTheDocument(); // Fresh Pasta
      expect(screen.queryByTestId('leftover-card-2')).not.toBeInTheDocument(); // Frozen Pizza
      expect(screen.queryByTestId('leftover-card-3')).not.toBeInTheDocument(); // Expired Salad
      expect(screen.queryByTestId('leftover-card-4')).not.toBeInTheDocument(); // Almost Expired Soup
    });
  });

  it('displays a message when no leftovers are found', async () => {
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: null }
        },
        result: {
          data: {
            leftovers: []
          }
        }
      }
    ];

    renderComponent(mocks);

    await waitFor(() => {
      expect(screen.getByTestId('no-leftovers-alert')).toBeInTheDocument();
      expect(screen.getByTestId('no-leftovers-alert')).toHaveTextContent('No leftovers found');
    });
  });

  it('handles error state gracefully', async () => {
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: null }
        },
        error: new Error('Failed to fetch leftovers')
      }
    ];

    renderComponent(mocks);

    await waitFor(() => {
      expect(screen.getByTestId('error-alert')).toBeInTheDocument();
      expect(screen.getByTestId('error-alert')).toHaveTextContent('Error loading leftovers');
    });
  });

  // Test navigating to detail view
  it('provides links to detail and edit pages', async () => {
    const mockLeftovers = createMockLeftovers();
    const mocks = [
      {
        request: {
          query: GET_LEFTOVERS,
          variables: { location: null }
        },
        result: {
          data: {
            leftovers: mockLeftovers
          }
        }
      }
    ];

    renderComponent(mocks);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    // Check for detail links
    const detailButton = screen.getByTestId('view-details-btn-1');
    expect(detailButton).toHaveAttribute('href', '/details/1');

    // Check for edit links
    const editButton = screen.getByTestId('edit-btn-1');
    expect(editButton).toHaveAttribute('href', '/edit/1');
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore Date mock
  });
});