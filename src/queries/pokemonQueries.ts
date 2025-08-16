import { useQuery } from '@tanstack/react-query';
import { PokemonSummary, Pokemon } from '../components/CardList/CardList';

export interface PokemonDetails extends Pokemon {
  abilities: { ability: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
}

const fetchPokemonList = async (page: number, itemsPerPage: number) => {
  const offset = (page - 1) * itemsPerPage;

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`,
    { cache: 'no-store' }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();

  const pokemonDetails = await Promise.all(
    data.results.map(async (summary: PokemonSummary) => {
      const detailResponse = await fetch(summary.url, { cache: 'no-store' });
      if (!detailResponse.ok) {
        throw new Error(`HTTP error! Status: ${detailResponse.status}`);
      }
      const detailData = await detailResponse.json();
      return detailData as PokemonDetails;
    })
  );

  return { pokemonDetails, totalCount: data.count };
};

const fetchPokemonByName = async (name: string) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`,
    { cache: 'no-store' }
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No Pokémon found');
    }
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return (await response.json()) as PokemonDetails;
};

export const usePokemonList = (
  page: number,
  itemsPerPage: number,
  searchTerm: string
) => {
  return useQuery<{ pokemonDetails: Pokemon[]; totalCount: number }, Error>({
    queryKey: ['pokemonList', page, searchTerm],
    queryFn: () =>
      searchTerm
        ? fetchPokemonByName(searchTerm).then((data) => ({
            pokemonDetails: [data as Pokemon],
            totalCount: 1,
          }))
        : fetchPokemonList(page, itemsPerPage),
    staleTime: 0,
    gcTime: 0,
    networkMode: 'always',
  });
};

export const usePokemonDetails = (pokemonId?: string) => {
  return useQuery<PokemonDetails, Error>({
    queryKey: ['pokemonDetails', pokemonId],
    queryFn: () => fetchPokemonByName(pokemonId || ''),
    enabled: !!pokemonId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    networkMode: 'always',
  });
};
