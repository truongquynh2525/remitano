import { shallow } from 'enzyme';
import ReactPlayer from 'react-player/youtube';
import Video from './Video';

describe('Video', () => {
  const mockProps = {
    videoUrl: 'https://www.youtube.com/watch?v=1234567890',
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<Video {...mockProps} />);
    expect(wrapper).toHaveLength(1);
  });

  it('renders a ReactPlayer component', () => {
    const wrapper = shallow(<Video {...mockProps} />);
    expect(wrapper.find(ReactPlayer)).toHaveLength(1);
  });

  it('passes the video URL to the ReactPlayer component', () => {
    const wrapper = shallow(<Video {...mockProps} />);
    expect(wrapper.find(ReactPlayer).prop('url')).toBe(mockProps.videoUrl);
  });

  it('sets the height to 300px', () => {
    const wrapper = shallow(<Video {...mockProps} />);
    expect(wrapper.find(ReactPlayer).prop('height')).toBe('300px');
  });

  it('sets the width to auto', () => {
    const wrapper = shallow(<Video {...mockProps} />);
    expect(wrapper.find(ReactPlayer).prop('width')).toBe('auto');
  });

  it('enables controls', () => {
    const wrapper = shallow(<Video {...mockProps} />);
    expect(wrapper.find(ReactPlayer).prop('controls')).toBe(true);
  });

  it('applies margin of 2% on top and bottom and 10% on the sides', () => {
    const wrapper = shallow(<Video {...mockProps} />);
    expect(wrapper.find(ReactPlayer).prop('style')).toMatchObject({
      margin: '2% 10%',
    });
  });
});
