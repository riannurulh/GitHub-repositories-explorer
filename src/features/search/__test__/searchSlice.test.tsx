import { configureStore } from '@reduxjs/toolkit';
import searchReducer, { fetchSearchQuery } from '../searchSlice';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import PostCreate from '../../../helpers/PostRequest';


vi.mock('../../../helpers/PostRequest');

describe('Search Slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return the initial state', () => {
    const store = configureStore({
      reducer: {
        search: searchReducer
      }
    });
    
    expect(store.getState().search).toEqual({
      searchQuery: [],
      loading: false,
      error: null
    });
  });

  test('should handle pending state', () => {
    const store = configureStore({
      reducer: {
        search: searchReducer
      }
    });
    
    store.dispatch({ type: 'search/fetchSearchQuery/pending' });
    
    expect(store.getState().search).toEqual({
      searchQuery: [],
      loading: true,
      error: null
    });
  });

  test('should handle fulfilled state', () => {
    const store = configureStore({
      reducer: {
        search: searchReducer
      }
    });
    
    const mockData = [{ id: 1, login: 'testuser' }];
    
    store.dispatch({
      type: 'search/fetchSearchQuery/fulfilled',
      payload: mockData
    });
    
    expect(store.getState().search).toEqual({
      searchQuery: mockData,
      loading: false,
      error: null
    });
  });

  test('should handle rejected state', () => {
    const store = configureStore({
      reducer: {
        search: searchReducer
      }
    });
    
    store.dispatch({
      type: 'search/fetchSearchQuery/rejected',
      payload: 'Error message'
    });
    
    expect(store.getState().search).toEqual({
      searchQuery: [],
      loading: false,
      error: 'Error message'
    });
  });

  describe('fetchSearchQuery async thunk', () => {
    test('should fetch users and their repositories successfully', async () => {
      const mockUsers = {
        data: {
          items: [
            { id: 1, login: 'user1' },
            { id: 2, login: 'user2' }
          ]
        }
      };
      
      const mockRepos1 = {
        data: [{ name: 'repo1', id: 101, description: 'Test repo 1', stargazers_count: 10 }]
      };
      
      const mockRepos2 = {
        data: [{ name: 'repo2', id: 102, description: 'Test repo 2', stargazers_count: 20 }]
      };
      
      const mockPostCreate = vi.mocked(PostCreate);
      mockPostCreate
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce(mockRepos1)
        .mockResolvedValueOnce(mockRepos2);
      
      const dispatch = vi.fn();
      const thunk = fetchSearchQuery('testquery');
      
      await thunk(dispatch, () => ({}), undefined);
      
      expect(mockPostCreate).toHaveBeenNthCalledWith(1, {
        url: '/search/users?q=testquery&per_page=5',
        method: 'GET'
      });
      
      expect(mockPostCreate).toHaveBeenNthCalledWith(2, {
        url: '/users/user1/repos',
        method: 'GET',
        headers: {
          Authorization: expect.any(String)
        }
      });
      
      expect(mockPostCreate).toHaveBeenNthCalledWith(3, {
        url: '/users/user2/repos',
        method: 'GET',
        headers: {
          Authorization: expect.any(String)
        }
      });
    });
    
    test('should handle "No user found" error', async () => {
      const mockEmptyUsers = {
        data: {
          items: []
        }
      };
      
      const mockPostCreate = vi.mocked(PostCreate);
      mockPostCreate.mockResolvedValueOnce(mockEmptyUsers);
      
      const dispatch = vi.fn();
      const thunk = fetchSearchQuery('nonexistentuser');
      
      const result = await thunk(dispatch, () => ({}), undefined);
      
      expect(result.meta.requestStatus).toBe('rejected');
      expect(result.payload).toBe('No user found');
    });
    
    test('should handle network errors', async () => {
      const mockError = new Error('Network error');
      
      const mockPostCreate = vi.mocked(PostCreate);
      mockPostCreate.mockRejectedValueOnce(mockError);
      
      const dispatch = vi.fn();
      const thunk = fetchSearchQuery('testquery');
      
      const result = await thunk(dispatch, () => ({}), undefined);
      
      expect(result.meta.requestStatus).toBe('rejected');
      expect(result.payload).toBe('Network error');
    });
    
    test('should handle API errors with response data', async () => {
      const mockApiError = {
        response: {
          data: {
            message: 'API rate limit exceeded'
          }
        }
      };
      
      const mockPostCreate = vi.mocked(PostCreate);
      mockPostCreate.mockRejectedValueOnce(mockApiError);
      
      const dispatch = vi.fn();
      const thunk = fetchSearchQuery('testquery');
      
      const result = await thunk(dispatch, () => ({}), undefined);
      
      expect(result.meta.requestStatus).toBe('rejected');
      expect(result.payload).toBe('API rate limit exceeded');
    });
    
    test('should handle unknown errors', async () => {
      const mockUnknownError = 'Some string error';
      
      const mockPostCreate = vi.mocked(PostCreate);
      mockPostCreate.mockRejectedValueOnce(mockUnknownError);
      
      const dispatch = vi.fn();
      const thunk = fetchSearchQuery('testquery');
      
      const result = await thunk(dispatch, () => ({}), undefined);
      
      expect(result.meta.requestStatus).toBe('rejected');
      expect(result.payload).toBe('Unknown error occurred');
    });
  });
});