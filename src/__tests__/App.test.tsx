import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';

import { server } from './mocks/server';
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sets throwError to true and shows ErrorBoundary UI', () => {
    render(<App />);
    const throwErrorButton = screen.getByRole('button', {
      name: /Throw Error/i,
    });
    fireEvent.click(throwErrorButton);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Test error thrown by button/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Try Again/i })
    ).toBeInTheDocument();
  });

  it('updates searchTerm via handleSearch and renders CardList', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    fireEvent.change(input, { target: { value: 'pikachu' } });
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });

  it('resets throwError via handleResetError and renders CardList', async () => {
    render(<App />);
    const throwErrorButton = screen.getByRole('button', {
      name: /Throw Error/i,
    });
    fireEvent.click(throwErrorButton);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(tryAgainButton);

    await waitFor(
      () => {
        expect(
          screen.queryByText(/Something went wrong/i)
        ).not.toBeInTheDocument();
        expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
