import { shallow } from 'enzyme'
import { IoHome } from 'react-icons/io5'
import { Typography } from 'antd'
import MHeader from './Header'

const { Title } = Typography

const mockUseNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

describe('MHeader', () => {
  let wrapper: any
  const navigate = jest.fn()

  beforeEach(() => {
    mockUseNavigate.mockReturnValue(navigate)
    wrapper = shallow(<MHeader />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a home icon and a title', () => {
    expect(wrapper.find(IoHome)).toHaveLength(1)
    expect(wrapper.find(Title).prop('children')).toBe('Funny Movies')
  })

  it('calls useNavigate with correct parameter when home icon is clicked', () => {
    wrapper.find(IoHome).simulate('click')
    expect(navigate).toHaveBeenCalledWith('/remitano-app')
  })

  it('calls useNavigate with correct parameter when title is clicked', () => {
    wrapper.find(Title).simulate('click')
    expect(navigate).toHaveBeenCalledWith('/remitano-app')
  })
})
