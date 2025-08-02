import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CardList from './components/CardList/CardList';
import Search from './components/Search/Search';
import About from './components/About/About';
import NotFound from './components/NotFound/NotFound';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from './components/ThemeContext/ThemeContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
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

  const handleReset = () => {
    setSearchTerm('');
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link to="/">Home</Link>
            <ThemeToggle />
            <Link to="/about">About</Link>
          </nav>
          <ErrorBoundary onReset={handleReset}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Search onSearch={handleSearch} />
                    <MainContent searchTerm={searchTerm} />
                  </>
                }
              />
              <Route
                path="/page/:page"
                element={
                  <>
                    <Search onSearch={handleSearch} />
                    <MainContent searchTerm={searchTerm} />
                  </>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
