import { downloadCSV } from '../utils/downloadCSV';
import { Pokemon } from '../store/pokemonStore';

describe('downloadCSV', () => {
  it('generates and downloads CSV for selected pokemons', () => {
    const mockPokemons: Pokemon[] = [
      {
        id: 25,
        name: 'pikachu',
        types: [{ type: { name: 'electric' } }],
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
    ];
    const { blob, filename } = downloadCSV(mockPokemons);
    expect(filename).toBe('1_items.csv');
    expect(blob).toBeInstanceOf(Blob);
  });
});
