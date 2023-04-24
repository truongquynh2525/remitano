import { render, fireEvent, waitFor } from '@testing-library/react';
import Share from './Share';
import { shareVideo } from '../services/HttpService';
import { removeAuthToken } from '../utils';

jest.mock('../services/HttpService', () => ({
  shareVideo: jest.fn()
}));

jest.mock('../utils', () => ({
  getAuthUsername: jest.fn(),
  removeAuthToken: jest.fn()
}));

describe('Share component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByLabelText, getByText } = render(<Share />);
    expect(getByLabelText('Youtube URL')).toBeInTheDocument();
    expect(getByText('Share')).toBeInTheDocument();
  });

  it('should share the video when "Share" button is clicked', async () => {
    const { getByLabelText, getByText } = render(<Share />);
    const youtubeUrlInput = getByLabelText('Youtube URL');
    const shareButton = getByText('Share');

    fireEvent.change(youtubeUrlInput, { target: { value: 'https://www.youtube.com/watch?v=123' } });
    fireEvent.click(shareButton);

    expect(shareVideo).toHaveBeenCalledWith(expect.anything(), 'https://www.youtube.com/watch?v=123');

    await waitFor(() => expect(getByText('Thank you for sharing the video')).toBeInTheDocument());
  });

  it('should display an error message if the video URL is not valid', async () => {
    const { getByLabelText, getByText } = render(<Share />);
    const youtubeUrlInput = getByLabelText('Youtube URL');
    const shareButton = getByText('Share');

    fireEvent.change(youtubeUrlInput, { target: { value: 'invalid url' } });
    fireEvent.click(shareButton);

    await waitFor(() => expect(getByText('Your video is not valid')).toBeInTheDocument());
  });

  it('should sign out when "Logout" button is clicked', () => {
    const { getByText } = render(<Share />);
    const logoutButton = getByText('Logout');

    fireEvent.click(logoutButton);

    expect(removeAuthToken).toHaveBeenCalled();
  });
});
