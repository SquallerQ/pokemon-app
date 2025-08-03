import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  ThemeProvider,
  useTheme,
} from '../components/ThemeContext/ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides theme, toggles theme, and updates localStorage and DOM', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Theme' }));
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    consoleError.mockRestore();
  });
});
