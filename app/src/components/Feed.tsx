import { Row, Col } from 'antd'
import Note from './Note'
import Video from './Video'
import { TFeed } from '@types'

const Feed = ({ videoId, videoUrl, userPosted }: TFeed) => {
  return (
    <Row>
      <Col style={{ justifyContent: 'center'}} span={12}>
        <Video videoUrl={videoUrl}/>
      </Col>
      <Col span={12}>
        <Note videoId={videoId} userPosted={userPosted}/>
      </Col>
    </Row>
  )
}

export default Feed
