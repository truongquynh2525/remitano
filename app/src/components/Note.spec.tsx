import { render, screen, fireEvent } from '@testing-library/react'
import { TNote } from '@types'
import Note from './Note'
import { voteVideo } from '../services/HttpService'
import { VoteActions } from '../constants/Vote'
import { notification } from 'antd'

jest.mock('../services/HttpService')
jest.mock('../utils')

describe('Note', () => {
  const mockNote: TNote = {
    videoId: '1234',
    userPosted: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the note details', async () => {
    const votes = [10, 2]
    const votedStatus: any = VoteActions.THUMBS_UP || VoteActions.THUMBS_DOWN || VoteActions.UN_VOTED
    jest.fn().mockResolvedValueOnce({ data: votes })
    jest.fn().mockResolvedValueOnce({ data: votedStatus })

    render(<Note {...mockNote} />)

    expect(screen.getByText(`Shared by: ${mockNote.userPosted}`)).toBeInTheDocument()
    expect(screen.getByText(`${votes[0]}`)).toBeInTheDocument()
    expect(screen.getByText(`${votes[1]}`)).toBeInTheDocument()
    expect(screen.getByText('Description:')).toBeInTheDocument()
    expect(screen.getByText(/Lorem ipsum/)).toBeInTheDocument()

    // Expect vote icons based on voted status
    const thumbsUpIcon = screen.getByRole('button', { name: 'thumbs-up' })
    const thumbsDownIcon = screen.getByRole('button', { name: 'thumbs-down' })
    switch (votedStatus) {
      case VoteActions.THUMBS_UP:
        expect(thumbsUpIcon).toHaveClass('anticon', 'anticon-like', 'anticon-like-twotone')
        expect(thumbsDownIcon).not.toHaveClass('anticon', 'anticon-dislike', 'anticon-dislike-twotone')
        break
      case VoteActions.THUMBS_DOWN:
        expect(thumbsUpIcon).not.toHaveClass('anticon', 'anticon-like', 'anticon-like-twotone')
        expect(thumbsDownIcon).toHaveClass('anticon', 'anticon-dislike', 'anticon-dislike-twotone')
        break
      case VoteActions.UN_VOTED:
        expect(thumbsUpIcon).toHaveClass('anticon', 'anticon-like')
        expect(thumbsDownIcon).toHaveClass('anticon', 'anticon-dislike')
        break
    }
  })

  describe('voting behavior', () => {
    test('should show error notification when not logged in', async () => {
      jest.fn().mockReturnValueOnce(null);

      render(<Note {...mockNote} />);

      const thumbsUpIcon = screen.getByRole('button', { name: 'thumbs-up' });
      fireEvent.click(thumbsUpIcon);

      expect(notification.error).toHaveBeenCalledWith({
        message: 'Error when voting',
        description: 'Please sign in to vote',
      });
      expect(voteVideo).not.toHaveBeenCalled();
    });

    test('should show error notification when user already voted', async () => {
      jest.fn().mockReturnValueOnce('token1234');
      jest.fn().mockRejectedValueOnce(new Error());

      render(<Note {...mockNote} />);

      const thumbsDownIcon = screen.getByRole('button', { name: 'thumbs-down' });
      fireEvent.click(thumbsDownIcon);

      expect(notification.error).toHaveBeenCalledWith({
        message: 'Error when voting',
        description: 'You already voted',
      });
      expect(voteVideo).toHaveBeenCalled();
    });
  });
})
