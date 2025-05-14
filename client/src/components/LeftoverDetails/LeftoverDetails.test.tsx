/*
Test Plan: LeftoverDetails Component

Objectives:
- Verify rendering of leftover details and all subcomponents.
- Test user actions (edit, delete, consume, restore) and their effects.

Scenarios:
- Renders with valid leftover data, missing/partial data, and loading/error states.
- Handles user actions and updates UI accordingly.
- Displays confirmation dialogs and error messages as needed.

Edge Cases:
- No leftover data or invalid leftover ID.
- Action fails (e.g., network error on delete/consume).
- Rapid repeated actions or conflicting updates.
*/

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LeftoverDetails from './LeftoverDetails';
import { useLeftoverDetailsLogic } from '../../hooks/useLeftoverDetailsLogic';

jest.mock('../../hooks/useLeftoverDetailsLogic');

const mockSetDeleteDialogOpen = jest.fn();
const mockSetConsumeDialogOpen = jest.fn();
const mockSetConsumePortionDialogOpen = jest.fn();
const mockHandleDelete = jest.fn();
const mockHandleConsume = jest.fn();
const mockHandleConsumePortion = jest.fn();
const mockSetPortionAmount = jest.fn();
const mockNavigate = jest.fn();

const baseLogic = {
  loading: false,
  error: null,
  data: { leftover: {
    id: '1',
    name: 'Pizza',
    description: 'Cheese',
    portion: 2,
    storageLocation: 'fridge',
    storedDate: '2024-06-01',
    expiryDate: '1718064000000',
    tags: ['dinner'],
    consumed: false,
    createdAt: '1717286400000',
    updatedAt: '1717286400000',
  } },
  deleteDialogOpen: false,
  setDeleteDialogOpen: mockSetDeleteDialogOpen,
  consumeDialogOpen: false,
  setConsumeDialogOpen: mockSetConsumeDialogOpen,
  consumePortionDialogOpen: false,
  setConsumePortionDialogOpen: mockSetConsumePortionDialogOpen,
  portionAmount: 0.5,
  setPortionAmount: mockSetPortionAmount,
  handleDelete: mockHandleDelete,
  handleConsume: mockHandleConsume,
  handleConsumePortion: mockHandleConsumePortion,
  deleteLoading: false,
  consumeLoading: false,
  consumePortionLoading: false,
  navigate: mockNavigate,
};

describe('LeftoverDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLeftoverDetailsLogic as jest.Mock).mockReturnValue({ ...baseLogic });
  });

  it('renders leftover details', () => {
    render(
      <MemoryRouter>
        <LeftoverDetails />
      </MemoryRouter>
    );
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/cheese/i)).toBeInTheDocument();
    expect(screen.getByText(/dinner/i)).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    (useLeftoverDetailsLogic as jest.Mock).mockReturnValue({ ...baseLogic, loading: true });
    render(
      <MemoryRouter>
        <LeftoverDetails />
      </MemoryRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error alert when error is set', () => {
    (useLeftoverDetailsLogic as jest.Mock).mockReturnValue({ ...baseLogic, error: { message: 'Error!' } });
    render(
      <MemoryRouter>
        <LeftoverDetails />
      </MemoryRouter>
    );
    expect(screen.getByText(/error!/i)).toBeInTheDocument();
  });

  it('handles missing leftover data', () => {
    (useLeftoverDetailsLogic as jest.Mock).mockReturnValue({ ...baseLogic, data: { leftover: null } });
    render(
      <MemoryRouter>
        <LeftoverDetails />
      </MemoryRouter>
    );
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('opens delete dialog on delete action', () => {
    render(
      <MemoryRouter>
        <LeftoverDetails />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockSetDeleteDialogOpen).toHaveBeenCalledWith(true);
  });

  it('opens consume dialog on consume action', () => {
    render(
      <MemoryRouter>
        <LeftoverDetails />
      </MemoryRouter>
    );
    // There are multiple consume buttons; pick the one with text 'Consume All'
    const consumeAllButton = screen.getByRole('button', { name: /consume all/i });
    fireEvent.click(consumeAllButton);
    expect(mockSetConsumeDialogOpen).toHaveBeenCalledWith(true);
  });
});
