import { VoteActions } from '@constants'
import { CreateVoteDto } from '@dto'
import { Vote } from '@entities'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class VoteService {
  constructor(@InjectModel(Vote.name) private voteModel: Model<Vote>) {}

  async create(req: any, createVoteDto: CreateVoteDto): Promise<Vote> {
    const { videoId, action } = createVoteDto

    const voted = await this.voteModel.findOne({ video: videoId }).exec()
    if (voted && action === voted.action)
      return this.remove(req.user.userId, videoId)

    if (voted && action !== voted.action) this.remove(req.user.userId, videoId)
    const createdVote = new this.voteModel({
      action,
      video: videoId,
      user: req.user.userId,
    })

    return createdVote.save()
  }

  async findAll() {
    return Promise.all([
      this.voteModel
        .count({
          action: VoteActions.THUMBS_UP,
        })
        .exec(),
      this.voteModel
        .count({
          action: VoteActions.THUMBS_DOWN,
        })
        .exec(),
    ])
  }

  async voteStatus(req: any, videoId: string): Promise<string> {
    const voted = await this.voteModel.findOne({ video: videoId }).exec()
    if (!voted) return 'un_voted'

    return voted.action
  }

  async getTotalThumbsByVideoId(videoId: string) {
    return Promise.all([
      this.voteModel
        .count({
          video: videoId,
          action: VoteActions.THUMBS_UP,
        })
        .exec(),
      this.voteModel
        .count({
          video: videoId,
          action: VoteActions.THUMBS_DOWN,
        })
        .exec(),
    ])
  }

  async remove(userId: string, videoId: string) {
    return this.voteModel
      .findOneAndRemove({ user: userId, video: videoId })
      .exec()
  }
}
