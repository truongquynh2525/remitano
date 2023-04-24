import { Test, TestingModule } from '@nestjs/testing'
import { VideoService } from './video.service'
import { getModelToken } from '@nestjs/mongoose'
import { Video, User } from '@entities'
import { Model } from 'mongoose'
import { NotFoundException } from '@nestjs/common'
import { CreateVideoDto } from '@dto'

describe('VideoService', () => {
  let videoService: VideoService
  let videoModel: Model<Video>
  let userModel: Model<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getModelToken(Video.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile()

    videoService = module.get<VideoService>(VideoService)
    videoModel = module.get<Model<Video>>(getModelToken(Video.name))
    userModel = module.get<Model<User>>(getModelToken(User.name))
  })

  describe('create', () => {
    it('should throw NotFoundException when given invalid youtube url', async () => {
      const req = { user: { userId: 'abc123' } }
      const createVideoDto: CreateVideoDto = {
        videoUrl: 'https://www.invalidurl.com',
      }
      jest.spyOn(videoService, 'create')

      expect.assertions(1)
      try {
        await videoService.create(req, createVideoDto)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    })

    it('should create a new video with the given createVideoDto', async () => {
      const req = { user: { userId: 'abc123' } }
      const createVideoDto: CreateVideoDto = {
        videoUrl: 'https://www.youtube.com/watch?v=1234',
      }
      const expectedVideo = new videoModel({
        ...createVideoDto,
        user: req.user.userId,
      })
      jest.spyOn(videoModel, 'create').mockResolvedValue(expectedVideo as any)

      const result = await videoService.create(req, createVideoDto)

      expect(videoModel.create).toHaveBeenCalledWith(expectedVideo)
      expect(result).toEqual(expectedVideo)
    })
  })

  describe('findAll', () => {
    it('should return an array of videos', async () => {
      const mockVideos = [
        new videoModel({ title: 'Video 1' }),
        new videoModel({ title: 'Video 2' }),
      ]
      jest
        .spyOn(videoModel, 'find')
        .mockReturnValue({sort: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockVideos) }) }) })

      const result = await videoService.findAll()

      expect(videoModel.find).toHaveBeenCalled()
      expect(result).toEqual(mockVideos)
    })
  })
})
