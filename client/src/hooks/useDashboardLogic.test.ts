/*
Test Plan: useDashboardLogic Hook

Objectives:
- Test filtering, sorting, and derived state logic for dashboard.
- Ensure correct output for various input/props.

Scenarios:
- Filters leftovers by location, search, and status.
- Sorts leftovers by expiry, name, etc.
- Handles empty, all-expired, and all-consumed lists.

Edge Cases:
- No leftovers.
- Invalid or missing filter values.
*/

import { renderHook, act } from '@testing-library/react';
import { useDashboardLogic } from './useDashboardLogic';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { Leftover } from '../types/leftover.types';

jest.mock('@apollo/client');
jest.mock('react-router-dom');

const mockLeftovers: Leftover[] = [
  {
    id: '1',
    name: 'Pizza',
    description: 'Cheese',
    portion: 2,
    storageLocation: 'fridge',
    storedDate: '2024-06-01',
    expiryDate: '2024-06-10',
    tags: ['dinner'],
    consumed: false,
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01',
  },
  {
    id: '2',
    name: 'Soup',
    description: 'Tomato',
    portion: 1,
    storageLocation: 'freezer',
    storedDate: '2024-05-20',
    expiryDate: '2024-12-01',
    tags: ['lunch'],
    consumed: false,
    createdAt: '2024-05-20',
    updatedAt: '2024-05-20',
  },
  {
    id: '3',
    name: 'Cake',
    description: 'Chocolate',
    portion: 1,
    storageLocation: 'fridge',
    storedDate: '2024-06-05',
    expiryDate: '2024-06-07',
    tags: ['dessert'],
    consumed: true,
    consumedDate: '2024-06-06',
    createdAt: '2024-06-05',
    updatedAt: '2024-06-06',
  },
];

describe('useDashboardLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters leftovers by location from search params', () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: (key: string) => (key === 'location' ? 'fridge' : null) },
    ]);
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: { leftovers: mockLeftovers },
    });
    renderHook(() => useDashboardLogic());
    // Check that at least one call to useQuery had the correct location variable
    const calls = (useQuery as jest.Mock).mock.calls;
    expect(calls.some(call => call[1] && call[1].variables && call[1].variables.location === 'fridge')).toBe(true);
  });

  it('filters leftovers by search term (name, description, tags)', () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: () => null },
    ]);
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: { leftovers: mockLeftovers },
    });
    const { result } = renderHook(() => useDashboardLogic());
    act(() => {
      result.current.setSearchTerm('pizza');
    });
    expect(result.current.filteredLeftovers).toHaveLength(1);
    expect(result.current.filteredLeftovers[0].name).toBe('Pizza');
    act(() => {
      result.current.setSearchTerm('chocolate');
    });
    expect(result.current.filteredLeftovers).toHaveLength(1);
    expect(result.current.filteredLeftovers[0].name).toBe('Cake');
    act(() => {
      result.current.setSearchTerm('lunch');
    });
    expect(result.current.filteredLeftovers).toHaveLength(1);
    expect(result.current.filteredLeftovers[0].name).toBe('Soup');
  });

  it('returns all leftovers if no search term and no location', () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: () => null },
    ]);
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: { leftovers: mockLeftovers },
    });
    const { result } = renderHook(() => useDashboardLogic());
    expect(result.current.filteredLeftovers).toHaveLength(mockLeftovers.length);
  });

  it('handles empty leftovers list', () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: () => null },
    ]);
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: { leftovers: [] },
    });
    const { result } = renderHook(() => useDashboardLogic());
    expect(result.current.filteredLeftovers).toHaveLength(0);
  });

  it('handles loading and error states', () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: () => null },
    ]);
    (useQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
    });
    let { result } = renderHook(() => useDashboardLogic());
    expect(result.current.loading).toBe(true);
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: { message: 'Error' },
      data: undefined,
    });
    result = renderHook(() => useDashboardLogic()).result;
    expect(result.current.error).toBeDefined();
  });

  it('handles invalid filter values gracefully', () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: () => 'invalid-location' },
    ]);
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: { leftovers: mockLeftovers },
    });
    const { result } = renderHook(() => useDashboardLogic());
    // Should not filter out all leftovers due to invalid location
    expect(result.current.filteredLeftovers.length).toBeGreaterThan(0);
  });
});
