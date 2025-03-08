import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AsyncThunk, configureStore } from '@reduxjs/toolkit';
import searchReducer, { fetchSearchQuery, User } from '../../features/search/searchSlice';
import Home from '../Home';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { RootState } from '../../store';

vi.mock('../components/SearchForm/SearchForm', () => ({
  default: ({ handleSearch, query, setQuery }: { 
    handleSearch: React.FormEventHandler<HTMLFormElement>; 
    query: string; 
    setQuery: React.Dispatch<React.SetStateAction<string>>; 
  }) => (
    <form data-testid="search-form" onSubmit={handleSearch}>
      <input 
        data-testid="search-input" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button data-testid="search-button" type="submit">Search</button>
    </form>
  )
}));

vi.mock('../components/SearchList/SearchList', () => ({
  default: () => <div data-testid="search-list">Search Results</div>
}));

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => vi.fn().mockImplementation((action) => action),
  };
});

const mockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      search: searchReducer
    },
    preloadedState: {
      search: {
        searchQuery: [],
        loading: false,
        error: null,
        ...initialState
      }
    }
  });
};

vi.mock('../../features/search/searchSlice', async () => {
  const actual = await vi.importActual('../../features/search/searchSlice');
  return {
    ...actual,
    fetchSearchQuery: vi.fn()
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the search form and empty search list initially', () => {
    render(
      <Provider store={mockStore()}>
        <Home />
      </Provider>
    );

    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('search-list')).toBeInTheDocument();
    expect(screen.queryByText(/Showing users for/)).not.toBeInTheDocument();
  });

  test('handles search submission with non-empty query', async () => {
    const mockFetchSearchQuery = fetchSearchQuery as AsyncThunk<User[], string, {
        state: RootState;
        rejectValue: string;
      }>
    
    render(
      <Provider store={mockStore()}>
        <Home />
      </Provider>
    );

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'testuser');
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);

    expect(mockFetchSearchQuery).toHaveBeenCalledWith('testuser');
  });

  test('does not call fetchSearchQuery with empty query', async () => {
    const mockFetchSearchQuery = fetchSearchQuery as unknown as ReturnType<typeof vi.fn>;
    
    render(
      <Provider store={mockStore()}>
        <Home />
      </Provider>
    );

    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);

    expect(mockFetchSearchQuery).not.toHaveBeenCalled();
  });

  test('displays search results message when results are returned', async () => {
    const store = mockStore({
      searchQuery: [{ id: 1, login: 'user1' }]
    });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'testuser');
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Showing users for/)).toBeInTheDocument();
    });
  });

  test('displays "No user found" error message', () => {
    const store = mockStore({
      error: 'No user found'
    });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(screen.getByText('No user found')).toBeInTheDocument();
  });

  test('displays generic error message for other errors', () => {
    const store = mockStore({
      error: 'Network error'
    });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(screen.getByText('Error: Network error')).toBeInTheDocument();
  });

  test('clears query input after successful search', async () => {
    const store = mockStore();
    
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'testuser');
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    
    store.dispatch({
      type: 'search/fetchSearchQuery/fulfilled',
      payload: [{ id: 1, login: 'user1' }]
    });

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });
  });

  test('clears query input after error', async () => {
    const store = mockStore();
    
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'testuser');
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    
    store.dispatch({
      type: 'search/fetchSearchQuery/rejected',
      payload: 'Some error'
    });

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });
  });

  test('updates the queryRef when submitting a search', async () => {
    render(
      <Provider store={mockStore()}>
        <Home />
      </Provider>
    );

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'testuser');
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    
    const store = mockStore({
      searchQuery: [{ id: 1, login: 'user1' }]
    });
    
    cleanup();
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    
    await userEvent.type(screen.getByTestId('search-input'), 'testuser');
    fireEvent.submit(screen.getByTestId('search-form'));

    await waitFor(() => {
      expect(screen.getByText(/Showing users for/)).toBeInTheDocument();
    });
  });
});