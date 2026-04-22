import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { AppContext } from '../AppContext';

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AppContext.Provider>,
    renderOptions
  );
};

describe('Header', () => {
  it('should not render when loading', () => {
    const providerProps = {
      isLoggedIn: true,
      loading: true,
    };
    const { container } = renderWithContext(<Header />, { providerProps });
    expect(container.firstChild).toBeNull();
  });

  it('should not render when not logged in', () => {
    const providerProps = {
      isLoggedIn: false,
      loading: false,
    };
    const { container } = renderWithContext(<Header />, { providerProps });
    expect(container.firstChild).toBeNull();
  });

  it('should render when logged in and not loading', () => {
    const providerProps = {
      isLoggedIn: true,
      loading: false,
    };
    renderWithContext(<Header />, { providerProps });
    expect(screen.getByAltText('mage_logo_title')).toBeInTheDocument();
  });
});
