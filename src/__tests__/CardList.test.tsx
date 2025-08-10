import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useSearchParams, useParams } from 'react-router-dom';
import CardList from '../components/CardList/CardList';
import { usePokemonList } from '../queries/pokemonQueries';
import { usePokemonStore } from '../store/pokemonStore';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
    useParams: vi.fn(),
  };
});
vi.mock('../queries/pokemonQueries', () => ({ usePokemonList: vi.fn() }));
vi.mock('../store/pokemonStore', () => ({ usePokemonStore: vi.fn() }));
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});
vi.mock('../components/Card/Card', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid={`card-${name}`}>{name}</div>
  ),
}));
vi.mock('../components/PokemonDetails/PokemonDetails', () => ({
  default: ({
    pokemonId,
    onClose,
  }: {
    pokemonId?: string;
    onClose?: () => void;
  }) => {
    if (!pokemonId) return null;
    return (
      <div data-testid="pokemon-details">
        <span>Details {pokemonId}</span>
        <button onClick={() => onClose && onClose()}>close</button>
      </div>
    );
  },
}));

function renderWithClient(ui: React.ReactElement) {
  const testClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={testClient}>{ui}</QueryClientProvider>
  );
}

const mockPokemonData = {
  pokemonDetails: [
    {
      id: 25,
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
      types: [{ type: { name: 'electric' } }],
      sprites: { front_default: 'pikachu.png' },
    },
  ],
  totalCount: 1,
};

const mockSetSearchParams = vi.fn();
const mockRefetch = vi.fn();
const mockInvalidateQueries = vi.fn();
const mockQueryClient = {
  invalidateQueries: mockInvalidateQueries,
} as unknown as ReturnType<typeof useQueryClient>;

function renderCardListWithMocks() {
  vi.mocked(usePokemonList).mockReturnValue({
    data: mockPokemonData,
    refetch: mockRefetch,
  } as unknown as ReturnType<typeof usePokemonList>);

  return renderWithClient(
    <MemoryRouter>
      <CardList searchTerm="" />
    </MemoryRouter>
  );
}

describe('CardList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ page: '1' }),
      mockSetSearchParams,
    ]);
    vi.mocked(useParams).mockReturnValue({ page: '1' });
    vi.mocked(usePokemonStore).mockReturnValue({ selectedPokemons: [] });
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
  });

  it('renders pokemon cards and handles card click', () => {
    renderCardListWithMocks();

    expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('card-pikachu'));
    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: '1',
      pokemonId: '25',
    });
  });

  it('calls handleCloseDetails', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ page: '1', pokemonId: '25' }),
      mockSetSearchParams,
    ]);

    renderCardListWithMocks();

    fireEvent.click(screen.getByText('close'));
    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '1' });
  });

  it('handles refresh button click', async () => {
    mockInvalidateQueries.mockResolvedValue(undefined);
    mockRefetch.mockResolvedValue(undefined);

    renderCardListWithMocks();

    fireEvent.click(screen.getByText('Refresh'));

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['pokemonList', 1, ''],
        exact: true,
      });
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
