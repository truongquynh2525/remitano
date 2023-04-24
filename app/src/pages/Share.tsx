import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button, Layout, Typography, Card, Form, Input, notification } from 'antd'
import Content from '../components/Content';
import { shareVideo } from '../services/HttpService';
import { useState } from 'react';
import { getAuthUsername, removeAuthToken } from '../utils';
import { useNavigate } from 'react-router-dom'
import HttpService from '../services/Gateway';

const { Text } = Typography;

const Share = () => {
  const [videoUrl, setVideoUrl] = useState<string>('')
  const navigate = useNavigate()

  const handleClick = async () => {
    shareVideo(HttpService(), videoUrl)
      .then(() => {
        navigate('/remitano-app')
        notification['success']({
          message: 'Successfully',
          description: 'Thank you for sharing the video',
        })
      })
      .catch(() => {
        setVideoUrl('')
        notification['error']({
          message: 'Error when sharing',
          description: 'Your video is not valid',
        })
      })
  }

  const signOut = () => {
    removeAuthToken()
    navigate('/remitano-app')
  }

  return (
    <Layout>
      <Header>
        <Text>Welcome {getAuthUsername()}</Text>
        <Button>Share a movie</Button>
        <Button onClick={signOut}>Logout</Button>
      </Header>
      <Content>
        <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card style={{ border: '2px solid', margin: '10% 0' }}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '400px' }}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item
                label="Youtube URL"
                name="youtubeUrl"
                style={{ width: '100%', maxWidth: '400px' }}
                rules={[{ required: true, message: 'Please input youtube url' }]}
              >
                <Input onChange={e => setVideoUrl(e.target.value)} style={{ width: '100%', maxWidth: '400px' }} />
              </Form.Item>

              <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button htmlType="submit" onClick={handleClick}>
                  Share
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Layout>
      </Content>
      <Footer/>
    </Layout>
  )
}

export default Share