import React, { JSX, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 24;
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

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
          setTotalPages(1);
        } else {
          const offset = (page - 1) * itemsPerPage;
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`
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
          setTotalPages(Math.ceil(data.count / itemsPerPage));
        }
        setPokemonList(pokemonDetails);
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setIsLoading(false);
      }
    }

    fetchPokemon(searchTerm);
  }, [searchTerm, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 11) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 6) {
      return [
        ...Array.from({ length: 10 }, (_, i) => i + 1),
        '...',
        totalPages,
      ];
    }

    if (page >= totalPages - 5) {
      return [
        1,
        '...',
        ...Array.from({ length: 10 }, (_, i) => totalPages - 9 + i),
      ];
    }

    return [
      1,
      '...',
      ...Array.from({ length: 11 }, (_, i) => page - 5 + i),
      '...',
      totalPages,
    ];
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
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
      {!searchTerm && pokemonList.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={styles.pageButton}
          >
            Previous
          </button>
          {getPageNumbers().map((pageNum, index) =>
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum as number)}
                className={`${styles.pageButton} ${pageNum === page ? styles.active : ''}`}
              >
                {pageNum}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CardList;
