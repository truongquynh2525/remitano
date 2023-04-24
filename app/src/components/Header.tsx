import { Layout, Typography, Space } from 'antd'
import { IoHome } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Header } = Layout

function MHeader(props: any) {
  const navigate = useNavigate()

  const backToHome = () => {
    navigate('/remitano-app')
  }

  return (
    <Header style={{ margin: '0 10% 0 10%', padding: 0, backgroundColor: '#f5f5f5' }}>
      <Space style={{ float: 'left' }}>
        <IoHome style={{ fontSize: '350%', cursor: 'pointer' }} onClick={backToHome}/>
        <Title style={{ cursor: 'pointer' }} onClick={backToHome}>
          Funny Movies
        </Title>
      </Space>
      <Space style={{ float: 'right' }}>{props.children}</Space>
    </Header>
  )
}

export default MHeader
