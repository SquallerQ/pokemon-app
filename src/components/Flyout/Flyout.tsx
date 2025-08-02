import React, { JSX } from 'react';
import { usePokemonStore } from '../../store/pokemonStore';
import styles from './Flyout.module.css';

function Flyout(): JSX.Element {
  const { selectedPokemons, clearItems } = usePokemonStore();

  const downloadCSV = () => {
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
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedPokemons.length}_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
      <div className={styles.buttonContainer}>
        <button onClick={downloadCSV} className={styles.downloadButton}>
          Download CSV
        </button>
        <button onClick={clearItems} className={styles.clearButton}>
          Unselect all
        </button>
      </div>
    </div>
  );
}

export default Flyout;
