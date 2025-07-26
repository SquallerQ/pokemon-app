import React, { JSX, useState, useEffect } from 'react';
import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';
import styles from './CardList.module.css';

interface PokemonSummary {
  name: string;
  url: string;
}

interface Pokemon extends PokemonSummary {
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

interface CardListProps {
  searchTerm: string;
}

function CardList({ searchTerm }: CardListProps): JSX.Element {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPokemon(term: string) {
      setIsLoading(true);
      setError(null);
      try {
        let pokemonDetails: Pokemon[] = [];
        if (term) {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`
          );
          if (!response.ok) {
            throw new Error(
              response.status === 404
                ? 'No Pokémon found'
                : `HTTP error! Status: ${response.status}`
            );
          }
          const data: Pokemon = await response.json();
          pokemonDetails = [data];
        } else {
          const response = await fetch(
            'https://pokeapi.co/api/v2/pokemon?limit=100'
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          pokemonDetails = await Promise.all(
            data.results.map(async (summary: PokemonSummary) => {
              const detailResponse = await fetch(summary.url);
              if (!detailResponse.ok) {
                throw new Error(`HTTP error! Status: ${detailResponse.status}`);
              }
              return await detailResponse.json();
            })
          );
        }
        setPokemonList(pokemonDetails);
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setIsLoading(false);
      }
    }

    fetchPokemon(searchTerm);
  }, [searchTerm]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.grid}>
      {pokemonList.length > 0 ? (
        pokemonList.map((pokemon) => (
          <Card
            key={pokemon.name}
            name={pokemon.name}
            description={`Type: ${pokemon.types.map((t) => t.type.name).join(', ')}`}
            imageUrl={pokemon.sprites.front_default}
          />
        ))
      ) : (
        <div className={styles.noResults}>No Pokémon found</div>
      )}
    </div>
  );
}

export default CardList;
