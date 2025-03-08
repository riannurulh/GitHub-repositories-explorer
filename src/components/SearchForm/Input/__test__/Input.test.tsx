import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('Input Component', () => {
  const mockSetQuery = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders with correct placeholder', () => {
    render(<Input query="" setQuery={mockSetQuery} />);
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeInTheDocument();
  });
  
  test('displays the current query value', () => {
    render(<Input query="testuser" setQuery={mockSetQuery} />);
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toHaveValue('testuser');
  });
  
  test('calls setQuery when input value changes', async () => {
    render(<Input query="" setQuery={mockSetQuery} />);
    
    const input = screen.getByPlaceholderText('Enter username');
    await userEvent.type(input, 'a');
    
    expect(mockSetQuery).toHaveBeenCalledWith('a');
  });
  
  test('has the correct CSS classes', () => {
    render(<Input query="" setQuery={mockSetQuery} />);
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('p-[16px]');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('border-[#e7e7e7]');
    expect(input).toHaveClass('bg-[#f2f2f2]');
  });
});