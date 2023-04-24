import { Layout } from 'antd'

const { Content } = Layout

function MContent(props: any) {
  return (
    <Content style={{ margin: '0 10%', background: 'colorBgContainer', borderTop: '2px solid', minHeight: '300px' }}>
      {props.children}
    </Content>
  )
}

export default MContent
