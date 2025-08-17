'use client';

import React, { JSX } from 'react';
import { useRouter } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isVisible: boolean;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isVisible,
}: PaginationProps): JSX.Element {
  const t = useTranslations('Pagination');
  const router = useRouter();

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`/page/${page}`);
      onPageChange(page);
    }
  };

  if (!isVisible) {
    return <></>;
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        {t('previous')}
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
        {t('next')}
      </button>
    </div>
  );
}

export default Pagination;
