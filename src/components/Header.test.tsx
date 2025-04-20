import { render, screen } from '@testing-library/react';
import Header from './Header/Header';

describe('Header', () => {
  it('renders dark-mode toggle button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /dark mode/i })).toBeInTheDocument();
  });
});
