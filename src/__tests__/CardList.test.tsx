import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CardList from '../components/CardList/CardList';
import { server } from './mocks/server';
import { http } from 'msw';

vi.mock('../components/Card/Card', () => ({
  default: ({
    name,
    description,
    imageUrl,
  }: {
    name: string;
    description: string;
    imageUrl: string;
  }) => (
    <div data-testid={`card-${name}`}>
      {name} - {description} - {imageUrl}
    </div>
  ),
}));

vi.mock('../components/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

describe('CardList Component', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('renders Spinner during loading', () => {
    render(<CardList searchTerm="" />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders list of pokemons when searchTerm is empty', async () => {
    render(<CardList searchTerm="" />);
    await waitFor(
      () => {
        expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
        expect(
          screen.getByText(/pikachu - Type: electric - pikachu.png/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('renders single pokemon when searchTerm is provided', async () => {
    render(<CardList searchTerm="pikachu" />);
    await waitFor(
      () => {
        expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
        expect(
          screen.getByText(/pikachu - Type: electric - pikachu.png/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('renders error message when API returns 404', async () => {
    render(<CardList searchTerm="unknown" />);
    await waitFor(
      () => {
        expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('renders "No Pokémon found" when API returns empty list', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new Response(JSON.stringify({ count: 0, results: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    render(<CardList searchTerm="" />);
    await waitFor(
      () => {
        expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('fetches new data when searchTerm changes', async () => {
    const { rerender } = render(<CardList searchTerm="" />);
    await waitFor(
      () => {
        expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    rerender(<CardList searchTerm="pikachu" />);
    await waitFor(
      () => {
        expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
        expect(
          screen.getByText(/pikachu - Type: electric - pikachu.png/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
