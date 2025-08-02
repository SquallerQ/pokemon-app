import { create } from 'zustand';

interface Pokemon {
  id: number;
  name: string;
  url: string;
  types: { type: { name: string } }[];
}

interface PokemonStore {
  selectedPokemons: Pokemon[];
  addItem: (pokemon: Pokemon) => void;
  removeItem: (id: number) => void;
  clearItems: () => void;
}

export const usePokemonStore = create<PokemonStore>((set) => ({
  selectedPokemons: [],
  addItem: (pokemon) =>
    set((state) => ({
      selectedPokemons: [...state.selectedPokemons, pokemon],
    })),
  removeItem: (id) =>
    set((state) => ({
      selectedPokemons: state.selectedPokemons.filter((p) => p.id !== id),
    })),
  clearItems: () => set({ selectedPokemons: [] }),
}));
