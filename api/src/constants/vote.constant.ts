export enum VoteActions {
  THUMBS_UP = 'thumbs_up',
  THUMBS_DOWN = 'thumbs_down',
}

export const isYouTubeURLValid = (url: string) => {
  const regex = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+$/
  if (!regex.test(url)) return false

  return true
}
