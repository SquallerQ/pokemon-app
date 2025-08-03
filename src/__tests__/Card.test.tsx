import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../components/Card/Card';

describe('Card component', () => {
  const props = {
    id: 1,
    name: 'Charmander',
    description: 'Type: fire',
    imageUrl: 'charmander.png',
  };

  it('renders card elements and handles checkbox clicks', () => {
    render(<Card {...props} />);

    const image = screen.getByRole('img', { name: /charmander/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', props.imageUrl);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
  });

  it('handles checkbox click to remove pokemon', () => {
    render(<Card {...props} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
  });
});
