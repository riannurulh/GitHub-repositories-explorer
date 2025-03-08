import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../SearchForm';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../Input/Input', () => ({
  default: ({ query, setQuery }: { query: string; setQuery: (value: string) => void }) => (
    <input
      data-testid="search-input"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}));

vi.mock('../Button/Button', () => ({
  default: () => <button data-testid="mock-button" type="submit">Search</button>
}));

describe('SearchForm', () => {
  const mockHandleSearch = vi.fn();
  const mockSetQuery = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders Input and Button components', () => {
    render(
      <SearchForm
        handleSearch={mockHandleSearch}
        query="test"
        setQuery={mockSetQuery}
      />
    );
    
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('mock-button')).toBeInTheDocument();
  });
  
  test('calls handleSearch when form is submitted', async () => {
    render(
      <SearchForm
        handleSearch={mockHandleSearch}
        query="test"
        setQuery={mockSetQuery}
      />
    );
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    
    expect(mockHandleSearch).toHaveBeenCalledTimes(1);
  });
  
  test('passes query and setQuery to Input component', async () => {
    render(
      <SearchForm
        handleSearch={mockHandleSearch}
        query="test"
        setQuery={mockSetQuery}
      />
    );
    
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('test');
    
    await userEvent.type(input, 'a');
    expect(mockSetQuery).toHaveBeenCalled();
  });
});