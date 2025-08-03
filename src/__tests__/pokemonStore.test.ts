import { usePokemonStore } from '../store/pokemonStore';

interface Pokemon {
  id: number;
  name: string;
  url: string;
  types: Array<{ type: { name: string } }>;
}

describe('pokemonStore', () => {
  it('manages pokemon selection with addItem, removeItem, and clearItems', () => {
    const { addItem, removeItem, clearItems } = usePokemonStore.getState();

    const pokemon2: Pokemon = {
      id: 2,
      name: 'Bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
      types: [{ type: { name: 'grass' } }],
    };
    addItem(pokemon2);

    removeItem(1);
    expect(usePokemonStore.getState().selectedPokemons).toEqual([pokemon2]);

    clearItems();
    expect(usePokemonStore.getState().selectedPokemons).toEqual([]);
  });
});
