import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

jest.mock('../services/HttpService');
jest.mock('../services/Gateway');
jest.mock('../utils');

describe('Home component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const homeComponent = getByTestId('home');
    expect(homeComponent).toBeInTheDocument();
  });

  it('displays video feeds on mount', async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const contentElement = getByTestId('content');
    await waitFor(() => {
      expect(contentElement).toBeInTheDocument();
    });
  });

  it('displays welcome message and share button when signed in', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('test_user_token');
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('test_user_name');

    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const welcomeMessage = getByText(`Welcome test_user_name`);
    const shareButton = getByText('Share a movie');

    expect(welcomeMessage).toBeInTheDocument();
    expect(shareButton).toBeInTheDocument();
  });

  it('displays login/register form when not signed in', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login/Register');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('logs in successfully when username and password are entered', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login/Register');

    fireEvent.change(emailInput, { target: { value: 'test_user' } });
    fireEvent.change(passwordInput, { target: { value: 'test_password' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user_token', 'test_access_token');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user_name', 'test_user');
    });
  });

  it('logs out successfully when Logout button is clicked', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('test_user_token');
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('test_user_name');

    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const logoutButton = getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('user_token');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('user_name');
    });
  });
});
