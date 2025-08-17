'use client';

import React, { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useParams } from 'next/navigation';
import { useRouter } from '../../i18n/navigation';
import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import PokemonDetails from '../PokemonDetails/PokemonDetails';
import Flyout from '../Flyout/Flyout';
import styles from './CardList.module.css';
import { usePokemonStore } from '../../store/pokemonStore';
import { usePokemonList } from '../../queries/pokemonQueries';
import { useQueryClient } from '@tanstack/react-query';

export interface PokemonSummary {
  name: string;
  url: string;
}

export interface Pokemon extends PokemonSummary {
  id: number;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

interface CardListProps {
  searchTerm: string;
}

function CardList({ searchTerm }: CardListProps): JSX.Element {
  const t = useTranslations('CardList');
  const searchParams = useSearchParams();
  const params = useParams<{ page?: string; locale?: string }>();
  const router = useRouter();
  const currentPage = parseInt(params.page || '1', 10);
  const pokemonId = searchTerm ? null : searchParams.get('pokemonId');
  const { selectedPokemons } = usePokemonStore();
  const itemsPerPage = 24;
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = usePokemonList(
    currentPage,
    itemsPerPage,
    searchTerm
  );

  const totalPages = data ? Math.ceil(data.totalCount / itemsPerPage) : 1;

  const handleCardClick = (pokemon: Pokemon) => {
    if (searchTerm) return;
    router.push(`/page/${currentPage}?pokemonId=${pokemon.id}`);
  };

  const handleCloseDetails = () => {
    router.push(`/page/${currentPage}`);
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['pokemonList', currentPage, searchTerm],
      exact: true,
    });
    await refetch();
  };

  if (isLoading || isFetching) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.error}>{error.message}</div>;
  }

  return (
    <div className={`${styles.container} ${pokemonId ? styles.shiftLeft : ''}`}>
      <button onClick={handleRefresh} className={styles.refreshButton}>
        {t('refresh')}
      </button>
      <div className={styles.grid}>
        {data?.pokemonDetails?.length ? (
          data.pokemonDetails.map((pokemon) => (
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
          <div className={styles.noResults}>{t('noResults')}</div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={() => {}}
        isVisible={!searchTerm && !!data?.pokemonDetails?.length}
      />
      <PokemonDetails pokemonId={pokemonId} onClose={handleCloseDetails} />
      {selectedPokemons.length > 0 && <Flyout />}
    </div>
  );
}

export default CardList;
