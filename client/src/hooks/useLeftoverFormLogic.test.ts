/*
Test Plan: useLeftoverFormLogic Hook

Objectives:
- Test form state, validation, and submission logic for leftovers.
- Ensure correct handling of all input fields and edge cases.

Scenarios:
- Initializes with default/empty values and with pre-filled data (edit mode).
- Validates required fields, date pickers, and numeric inputs.
- Submits valid data and handles submission errors.
- Resets or cancels form as expected.

Edge Cases:
- Invalid or missing input values.
- Rapid user input or repeated submissions.
- Date in the past or invalid date format.
*/
import { renderHook, act } from '@testing-library/react';
import { useLeftoverFormLogic } from './useLeftoverFormLogic';
import * as apolloClient from '@apollo/client';
import type { MutationResult, QueryResult, OperationVariables } from '@apollo/client';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: undefined }),
  useNavigate: () => jest.fn(),
}));

describe('useLeftoverFormLogic', () => {
  beforeEach(() => {
    jest.spyOn(apolloClient, 'useQuery').mockReturnValue({ loading: false, error: undefined, data: undefined } as unknown as QueryResult<unknown, OperationVariables>);
    jest.spyOn(apolloClient, 'useMutation').mockReturnValue([
      jest.fn(),
      { loading: false, called: false, client: {} as unknown as apolloClient.ApolloClient<object>, reset: jest.fn() } as unknown as MutationResult<unknown>
    ]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('initializes with default values', () => {
    const { result } = renderHook(() => useLeftoverFormLogic());
    expect(result.current.name).toBe('');
    expect(result.current.portion).toBe(1);
    expect(result.current.tags).toEqual([]);
  });

  it('handles tag addition', () => {
    const { result } = renderHook(() => useLeftoverFormLogic());
    act(() => {
      result.current.setCurrentTag('test');
    });
    act(() => {
      result.current.handleAddTag();
    });
    expect(result.current.tags).toContain('test');
  });
});
