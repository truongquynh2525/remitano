import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from './Private';

const MockComponent = () => <div>Mock Component</div>;

describe('PrivateRoute component', () => {
  it('renders the component when authenticated', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue('auth-token');

    const { getByText } = render(
      <MemoryRouter initialEntries={['/private']}>
        <PrivateRoute path="/private" component={MockComponent} />
      </MemoryRouter>
    );

    expect(getByText('Mock Component')).toBeInTheDocument();
  });

  it('redirects to login page when not authenticated', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(null);

    const { container } = render(
      <MemoryRouter initialEntries={['/private']}>
        <PrivateRoute path="/private" component={MockComponent} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
    expect(window.location.pathname).toBe('/');
  });
});
