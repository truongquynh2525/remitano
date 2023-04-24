import { Layout } from 'antd'
import { TFooter } from '../types/Footers'

const { Footer } = Layout

function MFooter(props: TFooter) {
  return (
    <Footer>{props.text}</Footer>
  )
}

export default MFooter
