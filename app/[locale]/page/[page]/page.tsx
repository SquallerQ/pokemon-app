'use client';

import React from 'react';
import CardList from '../../../../src/components/CardList/CardList';
import Search from '../../../../src/components/Search/Search';
import ErrorBoundary from '../../../../src/components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '../../../../src/components/ThemeContext/ThemeContext';
import useLocalStorage from '../../../../src/hooks/useLocalStorage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function MainContent({ searchTerm }: { searchTerm: string }) {
  return <CardList searchTerm={searchTerm} />;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const queryClient = new QueryClient();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div>
          <ErrorBoundary onReset={handleReset}>
            <>
              <Search onSearch={handleSearch} />
              <MainContent searchTerm={searchTerm} />
            </>
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
