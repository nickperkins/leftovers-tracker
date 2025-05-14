/*
Test Plan: Dashboard Component

Objectives:
- Verify correct rendering of dashboard UI elements and sections.
- Ensure integration with dashboard logic (filters, sorting, derived state).
- Validate user interactions (filtering, sorting, navigation).

Scenarios:
- Renders with various leftover lists (empty, populated, all expired, all consumed).
- Applies filters and sorts leftovers as expected.
- Responds to user actions (search, filter, sort, select leftover).
- Displays correct state for loading, error, and empty cases.

Edge Cases:
- No leftovers present.
- All leftovers expired or consumed.
- Invalid or missing filter/sort values.
*/

import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useDashboardLogic } from '../../hooks/useDashboardLogic';

jest.mock('../../hooks/useDashboardLogic');

const mockSetSearchTerm = jest.fn();

const baseLogic = {
  loading: false,
  error: undefined,
  filteredLeftovers: [],
  searchTerm: '',
  setSearchTerm: mockSetSearchTerm,
  locationParam: null,
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner when loading', () => {
    (useDashboardLogic as jest.Mock).mockReturnValue({ ...baseLogic, loading: true });
    render(<Dashboard />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error alert when error', () => {
    (useDashboardLogic as jest.Mock).mockReturnValue({ ...baseLogic, error: { message: 'Error!' } });
    render(<Dashboard />);
    expect(screen.getByText(/error loading leftovers/i)).toBeInTheDocument();
  });

  it('shows info alert when no leftovers', () => {
    (useDashboardLogic as jest.Mock).mockReturnValue({ ...baseLogic, filteredLeftovers: [] });
    render(<Dashboard />);
    expect(screen.getByText(/no leftovers found/i)).toBeInTheDocument();
  });

  it('renders leftovers and consumed sections', () => {
    (useDashboardLogic as jest.Mock).mockReturnValue({
      ...baseLogic,
      filteredLeftovers: [
        { id: '1', name: 'Pizza', consumed: false },
        { id: '2', name: 'Cake', consumed: true },
      ],
    });
    render(<Dashboard />);
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/consumed items/i)).toBeInTheDocument();
    expect(screen.getByText(/cake/i)).toBeInTheDocument();
  });

  it('renders correct title for locationParam', () => {
    (useDashboardLogic as jest.Mock).mockReturnValue({ ...baseLogic, locationParam: 'fridge' });
    render(<Dashboard />);
    expect(screen.getByText(/leftovers in fridge/i)).toBeInTheDocument();
  });

  it('calls setSearchTerm on search input change', () => {
    (useDashboardLogic as jest.Mock).mockReturnValue({ ...baseLogic });
    render(<Dashboard />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'pizza' } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith('pizza');
  });
});