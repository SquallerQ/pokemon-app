import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  it('renders Search and CardList', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Search Pokémon/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('updates searchTerm via handleSearch and renders CardList', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });
});
