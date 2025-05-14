/*
Test Plan: LeftoverForm Component

Objectives:
- Verify correct rendering of form fields and validation messages.
- Ensure form submission, reset, and cancel behaviors work as expected.
- Validate integration with form logic and mutation hooks.

Scenarios:
- Renders all required fields (name, description, portion, location, expiry, tags).
- Shows validation errors for missing/invalid input.
- Calls submit handler with correct data.
- Resets or cancels form as expected.
- Handles loading and error states for mutation.

Edge Cases:
- Submitting with empty/invalid fields.
- Submitting with max/min values.
- Submitting with duplicate or special character tags.
*/

import { render, screen, fireEvent } from '@testing-library/react';
import LeftoverForm from './LeftoverForm';
import { useLeftoverFormLogic } from '../../hooks/useLeftoverFormLogic';

jest.mock('../../hooks/useLeftoverFormLogic');

const mockHandleSubmit = jest.fn((e) => e.preventDefault());
const mockHandleAddTag = jest.fn();
const mockHandleRemoveTag = jest.fn();
const mockSetName = jest.fn();
const mockSetDescription = jest.fn();
const mockSetPortion = jest.fn();
const mockSetStorageLocation = jest.fn();
const mockSetExpiryDate = jest.fn();
const mockSetCurrentTag = jest.fn();
const mockNavigate = jest.fn();

const baseLogic = {
  isEditing: false,
  name: '',
  setName: mockSetName,
  description: '',
  setDescription: mockSetDescription,
  portion: 1,
  setPortion: mockSetPortion,
  storageLocation: 'fridge',
  setStorageLocation: mockSetStorageLocation,
  expiryDate: new Date('2024-06-10'),
  setExpiryDate: mockSetExpiryDate,
  tags: [],
  currentTag: '',
  setCurrentTag: mockSetCurrentTag,
  error: null,
  fetchLoading: false,
  fetchError: null,
  handleAddTag: mockHandleAddTag,
  handleRemoveTag: mockHandleRemoveTag,
  handleSubmit: mockHandleSubmit,
  isLoading: false,
  navigate: mockNavigate,
};

describe('LeftoverForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLeftoverFormLogic as jest.Mock).mockReturnValue({ ...baseLogic });
  });

  it('renders all required fields', () => {
    render(<LeftoverForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/portion/i)).toBeInTheDocument();
    // Storage location is a radio group with options, not a text field
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByLabelText(/fridge/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/freezer/i)).toBeInTheDocument();
    // Expiry date is a group, not a text field
    expect(screen.getByRole('group', { name: /expiry date/i })).toBeInTheDocument();
    expect(screen.getByText(/tags/i)).toBeInTheDocument();
  });

  it('shows loading spinner when fetchLoading is true', () => {
    (useLeftoverFormLogic as jest.Mock).mockReturnValue({ ...baseLogic, fetchLoading: true });
    render(<LeftoverForm />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error alert when fetchError is set', () => {
    (useLeftoverFormLogic as jest.Mock).mockReturnValue({ ...baseLogic, fetchError: { message: 'Error!' } });
    render(<LeftoverForm />);
    expect(screen.getByText(/error loading leftover/i)).toBeInTheDocument();
  });

  it('shows error alert when error is set', () => {
    (useLeftoverFormLogic as jest.Mock).mockReturnValue({ ...baseLogic, error: 'Something went wrong' });
    render(<LeftoverForm />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('calls setName and setDescription on input change', () => {
    render(<LeftoverForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Pizza' } });
    expect(mockSetName).toHaveBeenCalledWith('Pizza');
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Yum' } });
    expect(mockSetDescription).toHaveBeenCalledWith('Yum');
  });

  it('calls handleSubmit on form submit', () => {
    const { container } = render(<LeftoverForm />);
    const form = container.querySelector('form');
    fireEvent.submit(form!);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('disables submit button when isLoading is true', () => {
    (useLeftoverFormLogic as jest.Mock).mockReturnValue({ ...baseLogic, isLoading: true });
    const { container } = render(<LeftoverForm />);
    // Find the submit button by type
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
  });

  it('calls navigate(-1) when cancel button is clicked', () => {
    render(<LeftoverForm />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
