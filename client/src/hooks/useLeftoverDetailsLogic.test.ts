/*
Test Plan: useLeftoverDetailsLogic Hook

Objectives:
- Test state and actions for leftover details (fetch, edit, delete, consume, restore).
- Ensure correct handling of loading, error, and success states.

Scenarios:
- Fetches leftover details by ID.
- Handles edit, delete, consume, and restore actions.
- Updates state and notifies parent/components as needed.

Edge Cases:
- Invalid or missing leftover ID.
- Action fails (e.g., network error).
- Rapid repeated actions or conflicting updates.
*/
import { renderHook, act } from '@testing-library/react';
import { useLeftoverDetailsLogic } from './useLeftoverDetailsLogic';
import * as apolloClient from '@apollo/client';
import type { MutationResult, QueryResult, OperationVariables } from '@apollo/client';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('useLeftoverDetailsLogic', () => {
  beforeEach(() => {
    jest.spyOn(apolloClient, 'useQuery').mockReturnValue({
      loading: false,
      error: undefined,
      data: { leftover: { id: '1' } },
      client: {},
      networkStatus: 7,
      called: true,
      observable: {},
      refetch: jest.fn(),
      fetchMore: jest.fn(),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
      subscribeToMore: jest.fn(),
      updateQuery: jest.fn(),
      variables: {},
    } as unknown as QueryResult<{ leftover: { id: string } }, OperationVariables>);
    jest.spyOn(apolloClient, 'useMutation').mockReturnValue([
      jest.fn(),
      { loading: false, called: false, client: {} as unknown as apolloClient.ApolloClient<object>, reset: jest.fn() } as unknown as MutationResult<unknown>
    ]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('returns loading, error, and data from useQuery', () => {
    const { result } = renderHook(() => useLeftoverDetailsLogic());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeDefined();
  });

  it('handles dialog state changes', () => {
    const { result } = renderHook(() => useLeftoverDetailsLogic());
    act(() => result.current.setDeleteDialogOpen(true));
    expect(result.current.deleteDialogOpen).toBe(true);
    act(() => result.current.setDeleteDialogOpen(false));
    expect(result.current.deleteDialogOpen).toBe(false);
  });
});
