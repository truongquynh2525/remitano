import Header from '../components/Header'
import Footer from '../components/Footer'
import Content from '../components/Content'
import Feed from '../components/Feed'
import { Fragment, useEffect, useState } from 'react'
import { Input, Button, Layout, Typography } from 'antd'
import { getVideos, loginService } from '../services/HttpService'
import { useNavigate } from 'react-router-dom'
import { getAuthToken, getAuthUsername, removeAuthToken, setAuthToken, setAuthUsername } from '../utils'
import HttpService from '../services/Gateway'

const { Text } = Typography

const Home = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [signed, setSigned] = useState<boolean>(false)
  const [videos, setVideos] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    if (getAuthToken()) setSigned(true)
  }, [])

  useEffect(() => {
    getVideos(HttpService()).then(res => setVideos(res.data))
  }, [])

  const handleClick = async () => {
    await loginService(HttpService(), { username, password })
      .then(res => {
        setAuthUsername(username)
        setAuthToken(res.data.access_token)
      })
    setSigned(true)
  }

  const signOut = () => {
    setSigned(false)
    removeAuthToken()
    navigate('/remitano-app')
  }

  return (
    <Layout>
      <Header>
        {
          signed ? (
            <Fragment>
              <Text>Welcome {getAuthUsername()}</Text>
              <Button onClick={() => navigate('/remitano-app/share')}>Share a movie</Button>
              <Button onClick={signOut}>Logout</Button>
            </Fragment>
          ) : (
            <Fragment>
              <Input required={true} placeholder='Email' onChange={e => setUsername(e.target.value)}/>
              <Input required={true} type='password' placeholder='Password' onChange={e => setPassword(e.target.value)}/>
              <Button onClick={handleClick}>Login/Register</Button>
            </Fragment>
          )
        }
      </Header>
      <Content>
        {videos && videos.map((video: any) => <Feed key={video._id} videoId={video._id} videoUrl={video.videoUrl} userPosted={video.user.username}/>)}
      </Content>
      <Footer/>
    </Layout>
  )
}

export default Home
