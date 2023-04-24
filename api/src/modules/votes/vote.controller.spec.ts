import { Test, TestingModule } from '@nestjs/testing'
import { VoteController } from './vote.controller'
import { VoteService } from './vote.service'
import { CreateVoteDto } from '@dto'
import { AuthGuard } from '@guards'

describe('VoteController', () => {
  let voteController: VoteController
  let voteService: VoteService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [VoteService],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    voteController = moduleRef.get<VoteController>(VoteController)
    voteService = moduleRef.get<VoteService>(VoteService)
  })

  describe('findAll', () => {
    it('should return an array of votes', async () => {
      const result = [{}, {}] as any
      jest.spyOn(voteService, 'findAll').mockImplementation(() => result)

      expect(await voteController.findAll()).toBe(result)
    })
  })

  describe('getTotalThumbsByVideoId', () => {
    it('should return total thumbs for the given video id', async () => {
      const videoId = 'video-id'
      const result = 42 as any
      jest
        .spyOn(voteService, 'getTotalThumbsByVideoId')
        .mockImplementation(() => result)

      expect(await voteController.getTotalThumbsByVideoId(videoId)).toBe(result)
      expect(voteService.getTotalThumbsByVideoId).toHaveBeenCalledWith(videoId)
    })
  })

  describe('voteStatus', () => {
    it('should return the vote status for the given video id', async () => {
      const videoId = 'video-id'
      const result = {} as any
      const request = { user: { userId: 'user-id' } } as any
      jest.spyOn(voteService, 'voteStatus').mockImplementation(() => result)

      expect(await voteController.voteStatus(request, videoId)).toBe(result)
      expect(voteService.voteStatus).toHaveBeenCalledWith(request, videoId)
    })
  })

  describe('create', () => {
    it('should create a new vote', async () => {
      const createVoteDto: CreateVoteDto = {
        videoId: 'video-id',
        action: 'thumbs_up',
      }
      const result = {} as any
      const request = { user: { userId: 'user-id' } } as any
      jest.spyOn(voteService, 'create').mockImplementation(() => result)

      expect(await voteController.create(request, createVoteDto)).toBe(result)
      expect(voteService.create).toHaveBeenCalledWith(request, createVoteDto)
    })
  })
})
