import { render, screen } from '@testing-library/react'
import Feed from './Feed'

describe('Feed component', () => {
  const videoId = '123'
  const videoUrl = 'https://example.com/video.mp4'
  const userPosted = 'Alice'

  it('renders video and note', () => {
    render(<Feed videoId={videoId} videoUrl={videoUrl} userPosted={userPosted} />)
    const videoElement = screen.getByTestId('video')
    const noteElement = screen.getByTestId('note')
    expect(videoElement).toBeInTheDocument()
    expect(noteElement).toBeInTheDocument()
  })

  it('passes props to video and note', () => {
    render(<Feed videoId={videoId} videoUrl={videoUrl} userPosted={userPosted} />)
    const videoElement = screen.getByTestId('video')
    const noteElement = screen.getByTestId('note')
    expect(videoElement).toHaveAttribute('videoUrl', videoUrl)
    expect(noteElement).toHaveAttribute('videoId', videoId)
    expect(noteElement).toHaveAttribute('userPosted', userPosted)
  })
})
