import React, { JSX, useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';
import styles from './CardList.module.css';

interface PokemonSummary {
  name: string;
  url: string;
}

interface Pokemon extends PokemonSummary {
  id: number;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

interface PokemonDetails extends Pokemon {
  abilities: { ability: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
}

interface CardListProps {
  searchTerm: string;
}

function CardList({ searchTerm }: CardListProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page } = useParams<{ page: string }>();
  const currentPage = parseInt(page || searchParams.get('page') || '1', 10);
  const pokemonId = searchParams.get('pokemonId');
  const itemsPerPage = 24;
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
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
          const data = await response.json();
          pokemonDetails = [
            { ...data, url: `https://pokeapi.co/api/v2/pokemon/${data.id}/` },
          ];
          setTotalPages(1);
          if (pokemonId) {
            setSearchParams({ page: currentPage.toString() });
          }
        } else {
          const offset = (currentPage - 1) * itemsPerPage;
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
  }, [searchTerm, currentPage, pokemonId, setSearchParams]);

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
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Pokémon not found'
              : `HTTP error! Status: ${response.status}`
          );
        }
        const data: PokemonDetails = await response.json();
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

  const getPokemonId = (pokemon: Pokemon): string => {
    return pokemon.id.toString();
  };

  const handleCardClick = (pokemon: Pokemon) => {
    if (searchTerm) return;
    const id = getPokemonId(pokemon);
    setSearchParams({ page: currentPage.toString(), pokemonId: id });
  };

  const handleCloseDetails = () => {
    setSearchParams({ page: currentPage.toString() });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
      setSelectedPokemon(null);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 11) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 6) {
      return [
        ...Array.from({ length: 10 }, (_, i) => i + 1),
        '...',
        totalPages,
      ];
    }

    if (currentPage >= totalPages - 5) {
      return [
        1,
        '...',
        ...Array.from({ length: 10 }, (_, i) => totalPages - 9 + i),
      ];
    }

    return [
      1,
      '...',
      ...Array.from({ length: 11 }, (_, i) => currentPage - 5 + i),
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
    <div
      className={`${styles.container} ${selectedPokemon ? styles.shiftLeft : ''}`}
    >
      <div className={styles.grid}>
        {pokemonList.length > 0 ? (
          pokemonList.map((pokemon) => (
            <div
              key={pokemon.name}
              onClick={() => handleCardClick(pokemon)}
              className={`${styles.cardWrapper} ${
                selectedPokemon?.name === pokemon.name ? styles.selected : ''
              }`}
            >
              <Card
                name={pokemon.name}
                description={`Type: ${pokemon.types.map((t) => t.type.name).join(', ')}`}
                imageUrl={pokemon.sprites.front_default}
                data-testid={`card-${pokemon.name}`}
              />
            </div>
          ))
        ) : (
          <div className={styles.noResults}>No Pokémon found</div>
        )}
      </div>
      {!searchTerm && pokemonList.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
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
                className={`${styles.pageButton} ${pageNum === currentPage ? styles.active : ''}`}
              >
                {pageNum}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
      {isDetailsLoading && <Spinner />}
      {detailsError && (
        <div className={styles.detailsPanel}>
          <button onClick={handleCloseDetails} className={styles.closeButton}>
            ×
          </button>
          <div className={styles.error}>{detailsError}</div>
        </div>
      )}
      {selectedPokemon && !isDetailsLoading && !detailsError && (
        <div className={styles.detailsPanel}>
          <button onClick={handleCloseDetails} className={styles.closeButton}>
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
      )}
    </div>
  );
}

export default CardList;
