import { isYouTubeURLValid } from '@constants'
import { CreateVideoDto } from '@dto'
import { User, Video } from '@entities'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(req: any, createVideoDto: CreateVideoDto): Promise<Video> {
    const { videoUrl } = createVideoDto
    if (!isYouTubeURLValid(videoUrl)) throw new NotFoundException()

    const createdVideo = new this.videoModel({
      ...createVideoDto,
      user: req.user.userId,
    })

    return createdVideo.save()
  }

  async findAll() {
    return this.videoModel
      .find()
      .sort({ _id: -1 })
      .populate('user', '', this.userModel)
      .exec()
  }
}
