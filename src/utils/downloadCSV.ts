import { Pokemon } from '../store/pokemonStore';

export const downloadCSV = (
  selectedPokemons: Pokemon[]
): { blob: Blob; filename: string } => {
  const headers = ['ID,Name,Description,Details URL'];
  const rows = selectedPokemons.map((pokemon) =>
    [
      pokemon.id,
      pokemon.name,
      `Type: ${pokemon.types.map((t) => t.type.name).join(',')}`,
      `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
    ].join(',')
  );
  const csvContent = [...headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return { blob, filename: `${selectedPokemons.length}_items.csv` };
};
