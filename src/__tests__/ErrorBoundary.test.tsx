import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test error');
};

const SafeChild = () => <div data-testid="child">No error</div>;

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error occurs', () => {
    const onReset = vi.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <SafeChild />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
    expect(onReset).not.toHaveBeenCalled();
  });

  it('renders error UI when child throws an error', () => {
    const onReset = vi.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Try Again/i })
    ).toBeInTheDocument();
    expect(onReset).not.toHaveBeenCalled();
  });

  it('calls onReset when Try Again is clicked', () => {
    const onReset = vi.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <ProblemChild />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(button);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('calls componentDidCatch on error', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    render(
      <ErrorBoundary onReset={vi.fn()}>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });
});
