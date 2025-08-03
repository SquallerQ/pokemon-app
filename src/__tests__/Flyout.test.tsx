import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Flyout from '../components/Flyout/Flyout';

vi.mock('../utils/downloadCSV', () => ({
  downloadCSV: vi
    .fn()
    .mockReturnValue({ blob: new Blob(), filename: '1_items.csv' }),
}));
const mockCreateObjectURL = vi.fn().mockReturnValue('blob:http://test');
const mockRevokeObjectURL = vi.fn();
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
  writable: true,
});

describe('Flyout', () => {
  it('renders Flyout and handles button clicks', () => {
    render(<Flyout />);
    const downloadButton = screen.getByRole('button', { name: 'Download CSV' });
    fireEvent.click(downloadButton);
  });
});
