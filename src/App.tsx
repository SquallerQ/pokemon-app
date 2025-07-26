import React, { JSX } from 'react';
import CardList from './components/CardList/CardList';
import Search from './components/Search/Search';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import useLocalStorage from './hooks/useLocalStorage';
import styles from './App.module.css';

interface MainContentProps {
  searchTerm: string;
}

function MainContent({ searchTerm }: MainContentProps): JSX.Element {
  return <CardList searchTerm={searchTerm} />;
}

function App(): JSX.Element {
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  return (
    <ErrorBoundary onReset={() => setSearchTerm('')}>
      <div className={styles.container}>
        <Search onSearch={handleSearch} />
        <MainContent searchTerm={searchTerm} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
