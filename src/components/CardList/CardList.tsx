import React, { JSX, useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import PokemonDetails from '../PokemonDetails/PokemonDetails';
import Flyout from '../Flyout/Flyout';
import styles from './CardList.module.css';
import { usePokemonStore } from '../../store/pokemonStore';

interface PokemonSummary {
  name: string;
  url: string;
}

interface Pokemon extends PokemonSummary {
  id: number;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

interface CardListProps {
  searchTerm: string;
}

function CardList({ searchTerm }: CardListProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page } = useParams<{ page: string }>();
  const currentPage = parseInt(page || searchParams.get('page') || '1', 10);
  const pokemonId = searchParams.get('pokemonId');
  const { selectedPokemons } = usePokemonStore();
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
          const data = await response.json();
          pokemonDetails = [
            {
              id: data.id,
              name: data.name,
              url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`,
              types: data.types,
              sprites: data.sprites,
            },
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
  }, [searchTerm, currentPage]);

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

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={`${styles.container} ${pokemonId ? styles.shiftLeft : ''}`}>
      <div className={styles.grid}>
        {pokemonList.length > 0 ? (
          pokemonList.map((pokemon) => (
            <div
              key={pokemon.name}
              onClick={() => handleCardClick(pokemon)}
              className={`${styles.cardWrapper} ${
                pokemonId && pokemon.id && pokemonId === pokemon.id.toString()
                  ? styles.selected
                  : ''
              }`}
            >
              <Card
                id={pokemon.id}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          if (page >= 1 && page <= totalPages) {
            setSearchParams({
              page: page.toString(),
              ...(pokemonId && { pokemonId }),
            });
          }
        }}
        isVisible={!searchTerm && pokemonList.length > 0}
      />
      <PokemonDetails pokemonId={pokemonId} onClose={handleCloseDetails} />
      {selectedPokemons.length > 0 && <Flyout />}
    </div>
  );
}

export default CardList;
