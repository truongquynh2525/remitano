import { Test, TestingModule } from '@nestjs/testing'
import { VideoController } from './video.controller'
import { VideoService } from './video.service'
import { CreateVideoDto } from '@dto'
import { AuthGuard } from '@guards'
import { Request } from '@nestjs/common'

describe('VideoController', () => {
  let controller: VideoController
  let service: VideoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [VideoService],
    }).compile()

    controller = module.get<VideoController>(VideoController)
    service = module.get<VideoService>(VideoService)
  })

  describe('findAll', () => {
    it('should return an array of videos', async () => {
      const videos = [{ id: 1, title: 'Video 1' }]
      jest.spyOn(service, 'findAll').mockResolvedValue(videos)

      expect(await controller.findAll()).toBe(videos)
    })
  })

  describe('create', () => {
    const req = { user: { userId: 1 } } as Request
    const createVideoDto: CreateVideoDto = { title: 'New Video', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }

    it('should create a new video', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(createVideoDto as any)

      expect(await controller.create(req, createVideoDto)).toBe(createVideoDto)
    })

    it('should throw an error when the video URL is invalid', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Video URL is invalid'))

      await expect(controller.create(req, { title: 'New Video', videoUrl: 'invalid-url' })).rejects.toThrowError('Video URL is invalid')
    })

    it('should use the AuthGuard', () => {
      const authGuard = controller.create['guards'][0]
      expect(authGuard).toBeInstanceOf(AuthGuard)
    })
  })
})
