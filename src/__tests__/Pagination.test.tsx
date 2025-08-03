import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination/Pagination';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('Pagination Component', () => {
  const mockSetSearchParams = vi.fn();

  const setup = (currentPage: number) => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ page: currentPage.toString() }),
      mockSetSearchParams,
    ]);

    render(
      <Pagination
        currentPage={currentPage}
        totalPages={100}
        onPageChange={(page) => {
          if (page >= 1 && page <= 100) {
            mockSetSearchParams({ page: page.toString() });
          }
        }}
        isVisible={true}
      />
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and updates URL on page button click', () => {
    setup(1);
    fireEvent.click(screen.getByText('2'));
  });

  it('handles Previous and Next buttons', () => {
    setup(50);
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  });
});
