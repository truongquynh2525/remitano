import { getVotesByVideo, voteStatus, voteVideo } from '../services/HttpService'
import { TNote } from '@types'
import { Typography, Space, notification } from 'antd'
import { AiOutlineLike, AiOutlineDislike, AiTwotoneLike, AiTwotoneDislike } from 'react-icons/ai'
import { VoteActions } from '../constants/Vote'
import { useEffect, useState } from 'react'
import { getAuthToken } from '../utils'
import HttpService from '../services/Gateway'

const { Title, Paragraph, Text } = Typography

function Note({ videoId, userPosted }: TNote) {
  const [thumbsUp, setThumbsUp] = useState<number>(0)
  const [thumbsDown, setThumbsDown] = useState<number>(0)
  const [votedStatus, setVotedStatus] = useState<string>()

  useEffect(() => {
    voteStatus(HttpService(), videoId).then(res => setVotedStatus(res.data))
  }, [videoId])

  useEffect(() => {
    if (videoId) getVotesByVideo(HttpService(), videoId).then(res => {
      setThumbsUp(res.data[0])
      setThumbsDown(res.data[1])
    })
  }, [videoId])

  const handleThumbsUp = async () => {
    if (!getAuthToken()) return notification['error']({
      message: 'Error when voting',
      description: 'Please sign in to vote',
    });

    voteVideo(HttpService(), { videoId, action: VoteActions.THUMBS_UP })
      .then(() => {
        getVotesByVideo(HttpService(), videoId).then(res => {
          setThumbsUp(res.data[0])
          setThumbsDown(res.data[1])
          if (res.data[0] === 0) setVotedStatus(VoteActions.UN_VOTED)
          else setVotedStatus(VoteActions.THUMBS_UP)
        })
      })
      .catch(() => notification['error']({
        message: 'Error when voting',
        description: 'You already voted this video',
      }))
  }

  const handleThumbsDown = async () => {
    if (!getAuthToken()) return notification['error']({
      message: 'Error when voting',
      description: 'Please sign in to vote',
    });

    voteVideo(HttpService(), { videoId, action: VoteActions.THUMBS_DOWN })
      .then(() => {
        getVotesByVideo(HttpService(), videoId).then(res => {
          setThumbsUp(res.data[0])
          setThumbsDown(res.data[1])
          if (res.data[1] === 0) setVotedStatus(VoteActions.UN_VOTED)
          else setVotedStatus(VoteActions.THUMBS_DOWN)
        })
      })
      .catch(() => notification['error']({
        message: 'Error when voting',
        description: 'You already voted this video',
      }))
  }

  return (
    <Typography style={{ marginTop: '2%'}}>
      <Title level={5} style={{ color: 'red' }}>Introduction</Title>
      <Paragraph>
        <Space>
          Shared by: {userPosted}
          {
            votedStatus === VoteActions.THUMBS_DOWN && (
              <Space>
                <AiTwotoneDislike style={{ fontSize: '60px' }}/>
                <Text>Voted-down</Text>
              </Space>
            )
          }
          {
            votedStatus === VoteActions.THUMBS_UP && (
              <Space>
                <AiTwotoneLike style={{ fontSize: '60px' }}/>
                <Text>Voted-up</Text>
              </Space>
            )
          }
          {
            votedStatus === VoteActions.UN_VOTED && (
              <Space>
                <AiOutlineLike style={{ fontSize: '60px' }}/>
                <AiOutlineDislike style={{ fontSize: '60px' }}/>
                <Text>Un-voted</Text>
              </Space>
            )
          }
        </Space>
      </Paragraph>
      <Paragraph>
        <Space>
          { thumbsUp }
          <AiOutlineLike style={{ cursor: 'pointer', fontSize: '30px' }} onClick={handleThumbsUp}/>
        </Space>
        <Space>
          { thumbsDown }
          <AiOutlineDislike style={{ cursor: 'pointer', fontSize: '30px' }} onClick={handleThumbsDown}/>
        </Space>
      </Paragraph>
      <Paragraph>
        Description: <br/>
        <Text strong>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti quibusdam voluptatibus harum eos consequatur delectus enim deserunt facere dignissimos esse, ipsam pariatur, ipsum sapiente temporibus repellendus saepe perferendis quam aliquid.
        </Text>
      </Paragraph>
    </Typography>
  )
}

export default Note
