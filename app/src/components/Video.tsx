import { TVideo } from '@types'
import ReactPlayer from 'react-player/youtube'

function Video(props: TVideo) {
  return (
    <ReactPlayer
      style={{ margin: '2% 10%'}}
      height='300px'
      width='auto'
      controls={true}
      url={props.videoUrl}
    />
  )
}

export default Video