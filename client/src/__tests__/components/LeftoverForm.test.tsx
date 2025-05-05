import { jest } from '@jest/globals';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LeftoverForm from '../../components/LeftoverForm';
import { CREATE_LEFTOVER, UPDATE_LEFTOVER, GET_LEFTOVER } from '../../graphql/leftovers';
import { addDays } from 'date-fns';
import { StorageLocation } from '../../types/leftover.types';

// Mock MUI DatePicker component since it doesn't render properly in tests
jest.mock('@mui/x-date-pickers/DatePicker', () => {
  return {
    // eslint-disable-next-line
    DatePicker: ({ label, value, onChange, sx, 'data-testid': testId }: {
      label: string;
      value: Date;
      onChange: (date: Date | null) => void;
      sx?: object;
      'data-testid': string;
    }) => (
      <div data-testid={testId} className="mock-date-picker">
        <label>{label}</label>
        <input
          type="text"
          value={value instanceof Date ? value.toISOString() : ''}
          onChange={(e) => onChange(new Date(e.target.value))}
        />
      </div>
    )
  };
});

// Mock router navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useNavigate: () => mockNavigate,
}));

describe('LeftoverForm Component', () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeAll(() => {
      // Save the original implementation of window.matchMedia
      originalMatchMedia = window.matchMedia;

      // Mock window.matchMedia
      interface MatchMediaQuery {
          media: string;
          matches: boolean;
          onchange: (() => void) | null;
          addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
          removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
          addListener: (listener: EventListenerOrEventListenerObject) => void;
          removeListener: (listener: EventListenerOrEventListenerObject) => void;
          dispatchEvent: (event: Event) => boolean;
      }

      Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: (query: string): MatchMediaQuery => ({
              media: query,
              matches: query === "(pointer: fine)",
              onchange: null,
              addEventListener: () => {},
              removeEventListener: () => {},
              addListener: () => {},
              removeListener: () => {},
              dispatchEvent: () => false,
          }),
      });
    });

    afterAll(() => {
      // Restore the original implementation of window.matchMedia
      window.matchMedia = originalMatchMedia;
    });
  const defaultProps = {};

  // Helper function to render the component with mocks
  const renderComponent = (
    mocks: MockedResponse[] = [],
    initialEntries: string[] = ['/leftovers/new']
  ) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path="/leftovers/new" element={<LeftoverForm {...defaultProps} />} />
              <Route path="/leftovers/edit/:id" element={<LeftoverForm {...defaultProps} />} />
            </Routes>
          </MemoryRouter>
        </LocalizationProvider>
      </MockedProvider>
    );
  };

  // Create mode tests
  describe('Create Mode', () => {
    it('renders the create form correctly', () => {
      renderComponent();

      expect(screen.getByTestId('form-title')).toHaveTextContent('Add New Leftover');
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('description-input')).toBeInTheDocument();
      expect(screen.getByTestId('portion-input')).toBeInTheDocument();
      expect(screen.getByTestId('location-control')).toBeInTheDocument();
      // TODO: Uncomment when DatePicker is properly mocked
      //expect(screen.getByTestId('expiry-date-picker')).toBeInTheDocument();
      expect(screen.getByTestId('tag-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Save');
    });

    it('validates required fields', async () => {
      renderComponent();

      // Clear the name field (which is required)
      const nameInput = screen.getByTestId('name-input').querySelector('input');
      if (nameInput) {
        fireEvent.change(nameInput, { target: { value: '' } });
      }

      // Submit the form
      fireEvent.click(screen.getByTestId('submit-button'));

      // Check for validation error
      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toHaveTextContent('Name is required');
      });
    });

    it('validates portion value', async () => {
      renderComponent();

      // We need to set a name to pass the first validation
      const nameInput = screen.getByTestId('name-input').querySelector('input');
        if (nameInput) {
            fireEvent.change(nameInput, { target: { value: 'Test Leftover' } });
        }
      // Set an invalid portion
      const portionInput = screen.getByTestId('portion-input').querySelector('input');
      if (portionInput) {
        fireEvent.change(portionInput, { target: { value: '0' } });
      }

      // Submit the form
      fireEvent.click(screen.getByTestId('submit-button'));

      // Check for validation error
      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toHaveTextContent('Portion must be greater than 0');
      });
    });

    it('submits the form correctly', async () => {
      const mockDate = new Date('2025-01-01');
      const expiryDate = addDays(mockDate, 3);

      const createMock = {
        request: {
          query: CREATE_LEFTOVER,
          variables: {
            leftoverInput: {
              name: 'Test Leftover',
              description: 'Test Description',
              portion: 1,
              storageLocation: 'fridge' as StorageLocation,
              expiryDate: expiryDate.getTime().toString(),
              tags: ['test', 'leftovers']
            }
          }
        },
        result: {
          data: {
            createLeftover: {
              id: '123',
              name: 'Test Leftover',
              description: 'Test Description',
              portion: 1,
              storageLocation: 'fridge' as StorageLocation,
              storedDate: mockDate.getTime().toString(),
              expiryDate: expiryDate.getTime().toString(),
              tags: ['test', 'leftovers'],
              consumed: false,
              consumedDate: null,
              createdAt: mockDate.getTime().toString(),
              updatedAt: mockDate.getTime().toString()
            }
          }
        }
      };

      // Mock the date
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // Render with create mock
      renderComponent([createMock]);

      // Fill out the form
      const nameInput = screen.getByTestId('name-input').querySelector('input');
      const descInput = screen.getByTestId('description-input').querySelector('textarea');
      const portionInput = screen.getByTestId('portion-input').querySelector('input');

      if (nameInput && descInput && portionInput) {
        await userEvent.type(nameInput, 'Test Leftover');
        await userEvent.type(descInput, 'Test Description');
        fireEvent.change(portionInput, { target: { value: '1' } });
      }

      // Add tags
      const tagInput = screen.getByTestId('tag-input').querySelector('input');
      if (tagInput) {
        await userEvent.type(tagInput, 'test');
        fireEvent.click(screen.getByTestId('add-tag-button'));
        await userEvent.type(tagInput, 'leftovers');
        fireEvent.click(screen.getByTestId('add-tag-button'));
      }

      // Submit the form
      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      jest.useRealTimers(); // Restore real timers
    });

    it('handles tag operations correctly', async () => {
      renderComponent();

      // Add a tag
      const tagInput = screen.getByTestId('tag-input').querySelector('input');
      if (tagInput) {
        await userEvent.type(tagInput, 'test-tag');
        fireEvent.click(screen.getByTestId('add-tag-button'));
      }

      // Check if tag was added
      expect(screen.getByTestId('tag-chip-test-tag')).toBeInTheDocument();

      // Remove the tag
      fireEvent.click(screen.getByTestId('tag-chip-test-tag').querySelector('svg')!);

      // Check if tag was removed
      expect(screen.queryByTestId('tag-chip-test-tag')).not.toBeInTheDocument();
    });
  });

  // Edit mode tests
  describe('Edit Mode', () => {
    const mockLeftover = {
      id: '456',
      name: 'Existing Leftover',
      description: 'Existing Description',
      portion: 2,
      storageLocation: 'freezer' as StorageLocation,
      storedDate: new Date().getTime().toString(),
      expiryDate: addDays(new Date(), 5).getTime().toString(),
      tags: ['existing', 'test'],
      consumed: false,
      consumedDate: null,
      createdAt: new Date().getTime().toString(),
      updatedAt: new Date().getTime().toString()
    };

    const fetchMock = {
      request: {
        query: GET_LEFTOVER,
        variables: { id: '456' }
      },
      result: {
        data: {
          leftover: mockLeftover
        }
      }
    };

    const updateMock = {
      request: {
        query: UPDATE_LEFTOVER,
        variables: {
          id: '456',
          leftoverInput: {
            name: 'Updated Leftover',
            description: 'Updated Description',
            portion: 2,
            storageLocation: 'freezer' as StorageLocation,
            expiryDate: mockLeftover.expiryDate,
            tags: ['existing', 'test', 'updated']
          }
        }
      },
      result: {
        data: {
          updateLeftover: {
            ...mockLeftover,
            name: 'Updated Leftover',
            description: 'Updated Description',
            tags: ['existing', 'test', 'updated']
          }
        }
      }
    };

    it('loads and displays existing leftover data', async () => {
      renderComponent([fetchMock], ['/leftovers/edit/456']);

      // First, loading state should be visible
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByTestId('form-title')).toHaveTextContent('Edit Leftover');
      });

      // Check if form is populated with fetched data
      expect(screen.getByTestId('name-input')).toHaveValue('Existing Leftover');
      expect(screen.getByTestId('description-input')).toHaveValue('Existing Description');
      expect(screen.getByTestId('freezer-radio')).toBeChecked();
      expect(screen.getByTestId('tag-chip-existing')).toBeInTheDocument();
      expect(screen.getByTestId('tag-chip-test')).toBeInTheDocument();
    });

    it('updates a leftover correctly', async () => {
      renderComponent([fetchMock, updateMock], ['/leftovers/edit/456']);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
      });

      // Update the name and description
      const nameInput = screen.getByTestId('name-input').querySelector('input');
      const descInput = screen.getByTestId('description-input').querySelector('textarea');

      if (nameInput && descInput) {
        fireEvent.change(nameInput, { target: { value: 'Updated Leftover' } });
        fireEvent.change(descInput, { target: { value: 'Updated Description' } });
      }

      // Add another tag
      const tagInput = screen.getByTestId('tag-input').querySelector('input');
      if (tagInput) {
        await userEvent.type(tagInput, 'updated');
        fireEvent.click(screen.getByTestId('add-tag-button'));
      }

      // Submit the form
      fireEvent.click(screen.getByTestId('submit-button'));

      // Verify navigation happens after update
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('handles fetch errors', async () => {
      const errorMock = {
        request: {
          query: GET_LEFTOVER,
          variables: { id: '456' }
        },
        error: new Error('Failed to fetch leftover')
      };

      renderComponent([errorMock], ['/leftovers/edit/456']);

      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
        expect(screen.getByTestId('error-alert')).toHaveTextContent('Error loading leftover');
      });
    });

    it('handles update errors', async () => {
      const updateErrorMock = {
        request: {
          query: UPDATE_LEFTOVER,
          variables: {
            id: '456',
            leftoverInput: {
              name: 'Updated Leftover',
              description: 'Updated Description',
              portion: 2,
              storageLocation: 'freezer' as StorageLocation,
              expiryDate: mockLeftover.expiryDate,
              tags: ['existing', 'test']
            }
          }
        },
        error: new Error('Failed to update leftover')
      };

      renderComponent([fetchMock, updateErrorMock], ['/leftovers/edit/456']);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
      });

      // Update the name and description
      const nameInput = screen.getByTestId('name-input').querySelector('input');
      const descInput = screen.getByTestId('description-input').querySelector('textarea');

      if (nameInput && descInput) {
        fireEvent.change(nameInput, { target: { value: 'Updated Leftover' } });
        fireEvent.change(descInput, { target: { value: 'Updated Description' } });
      }

      // Submit the form
      fireEvent.click(screen.getByTestId('submit-button'));

      // Check for error message
      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
        expect(screen.getByTestId('form-error')).toHaveTextContent('Error updating leftover');
      });
    });
  });

  it('navigates back when cancel is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});