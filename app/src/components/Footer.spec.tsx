import { shallow } from 'enzyme'
import { Layout } from 'antd'
import MFooter from './Footer'

const { Footer } = Layout

describe('MFooter component', () => {
  const props = {
    text: 'Footer Text'
  }

  it('should render without crashing', () => {
    const wrapper = shallow(<MFooter {...props} />)
    expect(wrapper).toBeTruthy()
  })

  it('should render a Footer component', () => {
    const wrapper = shallow(<MFooter {...props} />)
    expect(wrapper.find(Footer)).toHaveLength(1)
  })

  it('should display the text passed via props', () => {
    const wrapper = shallow(<MFooter {...props} />)
    expect(wrapper.text()).toEqual(props.text)
  })
})
