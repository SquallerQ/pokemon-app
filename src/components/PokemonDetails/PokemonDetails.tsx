import React, { JSX, useState, useEffect } from 'react';
import styles from './PokemonDetails.module.css';

interface PokemonDetailsData {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
  abilities: { ability: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
}

interface PokemonDetailsProps {
  pokemonId: string | null;
  onClose: () => void;
}

function PokemonDetails({
  pokemonId,
  onClose,
}: PokemonDetailsProps): JSX.Element {
  const [selectedPokemon, setSelectedPokemon] =
    useState<PokemonDetailsData | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPokemonDetails() {
      if (!pokemonId) {
        setSelectedPokemon(null);
        setDetailsError(null);
        return;
      }
      setIsDetailsLoading(true);
      setDetailsError(null);
      try {
        const response = await fetch(`
          https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Pokémon not found'
              : `HTTP error! Status: ${response.status}`
          );
        }
        const data: PokemonDetailsData = await response.json();
        setSelectedPokemon(data);
        setIsDetailsLoading(false);
      } catch (err) {
        setDetailsError(
          err instanceof Error ? err.message : 'An error occurred'
        );
        setIsDetailsLoading(false);
      }
    }
    fetchPokemonDetails();
  }, [pokemonId]);

  if (!pokemonId) {
    return <></>;
  }

  if (isDetailsLoading) {
    return <div className={styles.spinner}>Loading...</div>;
  }

  if (detailsError) {
    return (
      <div className={styles.detailsPanel}>
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
        <div className={styles.error}>{detailsError}</div>
      </div>
    );
  }

  if (!selectedPokemon) {
    return <></>;
  }

  return (
    <div className={styles.detailsPanel}>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
      <h2>{selectedPokemon.name.toUpperCase()}</h2>
      <img
        src={selectedPokemon.sprites.front_default}
        alt={selectedPokemon.name}
        className={styles.detailsImage}
      />
      <div className={styles.detailsInfo}>
        <p>
          <strong>Types:</strong>{' '}
          {selectedPokemon.types.map((t) => t.type.name).join(', ')}
        </p>
        <p>
          <strong>Abilities:</strong>{' '}
          {selectedPokemon.abilities.map((a) => a.ability.name).join(', ')}
        </p>
        <h3>Base Stats:</h3>
        <ul>
          {selectedPokemon.stats.map((stat) => (
            <li key={stat.stat.name}>
              {stat.stat.name}: {stat.base_stat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PokemonDetails;
