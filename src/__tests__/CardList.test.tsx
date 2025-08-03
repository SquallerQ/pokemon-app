import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { http } from 'msw';
import CardList from '../components/CardList/CardList';
import { server } from './mocks/server';

vi.mock('../components/Card/Card', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid={`card-${name}`} onClick={() => {}}>
      {name}
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

const pikachuData = {
  id: 25,
  name: 'pikachu',
  types: [{ type: { name: 'electric' } }],
  sprites: { front_default: 'pikachu.png' },
  abilities: [{ ability: { name: 'static' } }],
  stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
};

const mockSetSearchParams = vi.fn();

function renderCardList(
  searchTerm = '',
  initialEntries = ['/page/1'],
  searchParams = new URLSearchParams({ page: '1' })
) {
  vi.mocked(useSearchParams).mockReturnValue([
    searchParams,
    mockSetSearchParams,
  ]);
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <CardList searchTerm={searchTerm} />
    </MemoryRouter>
  );
}

describe('CardList', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  afterAll(() => server.close());

  it('renders Spinner during loading', () => {
    renderCardList();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  describe('fetching', () => {
    it('renders error on 404 response from API', async () => {
      server.use(
        http.get(
          'https://pokeapi.co/api/v2/pokemon/unknown',
          () => new Response(null, { status: 404 })
        )
      );
      renderCardList('unknown');
      await waitFor(() => {
        expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
      });
    });

    it('shows generic error if thrown value is not an Error', async () => {
      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon', () => {
          throw 'unexpected';
        })
      );
      renderCardList();
    });
  });

  describe('searchParams behavior', () => {
    beforeEach(() => {
      server.use(
        http.get(
          'https://pokeapi.co/api/v2/pokemon/25',
          () => new Response(JSON.stringify(pikachuData))
        )
      );
    });

    it('removes pokemonId from URL when panel closes', async () => {
      renderCardList(
        '',
        ['/page/1'],
        new URLSearchParams({ page: '1', pokemonId: '25' })
      );
      await waitFor(() => {
        expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
      });
    });

    it('updates URL when interacting with card and pagination', async () => {
      renderCardList();
      await waitFor(() => {
        expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('card-pikachu'));
      fireEvent.click(screen.getByText('2'));
    });
  });
});
