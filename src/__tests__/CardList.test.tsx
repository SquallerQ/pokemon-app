import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('CardList Component', () => {
  const mockSetSearchParams = vi.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]);
  });

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('renders Spinner during loading', async () => {
    render(
      <MemoryRouter>
        <CardList searchTerm="" />
      </MemoryRouter>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders list of pokemons when searchTerm is empty', async () => {
    render(
      <MemoryRouter>
        <CardList searchTerm="" />
      </MemoryRouter>
    );
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
    render(
      <MemoryRouter>
        <CardList searchTerm="pikachu" />
      </MemoryRouter>
    );
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
    render(
      <MemoryRouter>
        <CardList searchTerm="unknown" />
      </MemoryRouter>
    );
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
    render(
      <MemoryRouter>
        <CardList searchTerm="" />
      </MemoryRouter>
    );
    await waitFor(
      () => {
        expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('fetches new data when searchTerm changes', async () => {
    const { rerender } = render(
      <MemoryRouter>
        <CardList searchTerm="" />
      </MemoryRouter>
    );
    await waitFor(
      () => {
        expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    rerender(
      <MemoryRouter>
        <CardList searchTerm="pikachu" />
      </MemoryRouter>
    );
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

  it('updates URL when pagination button is clicked', async () => {
    server.use(
      http.get(
        'https://pokeapi.co/api/v2/pokemon',
        () =>
          new Response(
            JSON.stringify({
              count: 100,
              results: [
                {
                  name: 'pikachu',
                  url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
                },
              ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
      ),
      http.get(
        'https://pokeapi.co/api/v2/pokemon/pikachu',
        () =>
          new Response(
            JSON.stringify({
              name: 'pikachu',
              types: [{ type: { name: 'electric' } }],
              sprites: { front_default: 'pikachu.png' },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
      )
    );
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ page: '1' }),
      mockSetSearchParams,
    ]);

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <CardList searchTerm="" />
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByText('1')).toHaveAttribute(
          'class',
          expect.stringContaining('active')
        );
      },
      { timeout: 2000 }
    );

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '2' });
  });
});
