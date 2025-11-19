import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from './NavBar';

describe('Navbar Component', () => {
  it('renders the title correctly', () => {
    render(<Navbar />);
    expect(screen.getByText(/TO-DO LIST/i)).toBeInTheDocument();
  });

  it('renders the quote correctly', () => {
    render(<Navbar />);
    expect(screen.getByText(/Consistency beats intensity/i)).toBeInTheDocument();
  });
});