import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from './Loading';

describe('Loading', () => {
  it('should render the loading text', () => {
    render(<Loading loading={true} />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should have the isLoading class when loading is true', () => {
    const { container } = render(<Loading loading={true} />);
    expect(container.firstChild).toHaveClass('isLoading');
  });

  it('should not have the isLoading class when loading is false', () => {
    const { container } = render(<Loading loading={false} />);
    expect(container.firstChild).not.toHaveClass('isLoading');
  });
});
