import { render, screen } from '@testing-library/react';
import Spinner from '../components/Spinner/Spinner';

describe('Spinner Component', () => {
  it('renders spinner', () => {
    render(<Spinner />);
    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
  });
});
