import React, { JSX } from 'react';
import { usePokemonStore } from '../../store/pokemonStore';
import styles from './Flyout.module.css';

function Flyout(): JSX.Element {
  const { selectedPokemons, clearItems } = usePokemonStore();

  return (
    <div className={styles.flyout}>
      <h3>Selected Pokémon ({selectedPokemons.length})</h3>
      <ul className={styles.list}>
        {selectedPokemons.map((pokemon) => (
          <li key={pokemon.id} className={styles.listItem}>
            {pokemon.name}
          </li>
        ))}
      </ul>
      <button onClick={clearItems} className={styles.clearButton}>
        Unselect all
      </button>
    </div>
  );
}

export default Flyout;
