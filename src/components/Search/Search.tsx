import React, { JSX } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useTranslations } from 'next-intl';
import styles from './Search.module.css';

interface SearchProps {
  onSearch: (term: string) => void;
}

function Search({ onSearch }: SearchProps): JSX.Element {
  const t = useTranslations('Search');
  const [inputValue, setInputValue] = useLocalStorage('searchTerm', '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    const searchTerm = inputValue.trim();
    setInputValue(searchTerm);
    onSearch(searchTerm);
  };

  const handleReset = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={styles.input}
        placeholder={t('placeholder')}
      />
      {inputValue && (
        <button
          onClick={handleReset}
          className={styles.resetButton}
          title={t('resetTitle')}
        >
          ✕
        </button>
      )}
      <button onClick={handleSearch} className={styles.button}>
        {t('searchButton')}
      </button>
    </div>
  );
}

export default Search;
