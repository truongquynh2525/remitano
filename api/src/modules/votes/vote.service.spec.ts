import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { VoteService } from './vote.service'
import { Vote } from '@entities'
import mongoose, { Model } from 'mongoose'
import { VoteActions } from '@constants'

describe('VoteService', () => {
  let voteService: VoteService
  let voteModel: Model<Vote>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: getModelToken(Vote.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndRemove: jest.fn(),
            create: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile()

    voteService = module.get<VoteService>(VoteService)
    voteModel = module.get<Model<Vote>>(getModelToken(Vote.name))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('create', () => {
    const userId = 'user123'
    const videoId = 'video123'

    beforeEach(async () => {
      // Reset the database before each test
      await mongoose.connection.db.dropDatabase()
    })

    it('should create a new vote', async () => {
      const req = { user: { userId } }
      const createVoteDto = { videoId, action: VoteActions.THUMBS_UP }

      const voteService = new VoteService(voteModel)

      const createdVote = await voteService.create(req, createVoteDto)

      expect(createdVote).toBeDefined()
      expect(createdVote.user).toEqual(userId)
      expect(createdVote.video).toEqual(videoId)
      expect(createdVote.action).toEqual(VoteActions.THUMBS_UP)
    })

    it('should remove an existing vote if the same action is selected', async () => {
      const req = { user: { userId } }
      const createVoteDto = { videoId, action: VoteActions.THUMBS_UP }

      const existingVote = new voteModel({
        user: userId,
        video: videoId,
        action: VoteActions.THUMBS_UP,
      })
      await existingVote.save()

      const voteService = new VoteService(voteModel)

      const removedVote = await voteService.create(req, createVoteDto)

      expect(removedVote).toBeDefined()
      expect(removedVote.user).toEqual(userId)
      expect(removedVote.video).toEqual(videoId)
      expect(removedVote.action).toEqual(VoteActions.THUMBS_UP)

      const foundVote = await voteModel
        .findOne({ user: userId, video: videoId })
        .exec()
      expect(foundVote).toBeNull()
    })

    it('should remove an existing vote if a different action is selected', async () => {
      const req = { user: { userId } }
      const createVoteDto = { videoId, action: VoteActions.THUMBS_UP }

      const existingVote = new voteModel({
        user: userId,
        video: videoId,
        action: VoteActions.THUMBS_DOWN,
      })
      await existingVote.save()

      const voteService = new VoteService(voteModel)

      const removedVote = await voteService.create(req, createVoteDto)

      expect(removedVote).toBeDefined()
      expect(removedVote.user).toEqual(userId)
      expect(removedVote.video).toEqual(videoId)
      expect(removedVote.action).toEqual(VoteActions.THUMBS_UP)

      const foundVote = await voteModel
        .findOne({ user: userId, video: videoId })
        .exec()
      expect(foundVote).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return the number of votes for each action', async () => {
      const voteModelMock = {
        count: jest
          .fn()
          .mockReturnValueOnce(Promise.resolve(10))
          .mockReturnValueOnce(Promise.resolve(5)),
      }
      const voteService = new VoteService(voteModelMock as any)

      const [thumbsUpCount, thumbsDownCount] = await voteService.findAll()

      expect(thumbsUpCount).toBe(10)
      expect(thumbsDownCount).toBe(5)
      expect(voteModelMock.count).toHaveBeenCalledTimes(2)
      expect(voteModelMock.count).toHaveBeenCalledWith({
        action: VoteActions.THUMBS_UP,
      })
      expect(voteModelMock.count).toHaveBeenCalledWith({
        action: VoteActions.THUMBS_DOWN,
      })
    })
  })

  describe('voteStatus', () => {
    it('should return "un_voted" if there is no vote for the given video', async () => {
      const videoId = '123'
      jest.fn().mockResolvedValueOnce(null)

      const result = await voteService.voteStatus({}, videoId)

      expect(result).toBe('un_voted')
      expect(voteModel.findOne).toHaveBeenCalledWith({ video: videoId })
    })

    it('should return the action of the vote for the given video', async () => {
      const videoId = '123'
      const action = VoteActions.THUMBS_UP
      jest.fn().mockResolvedValueOnce({ action })

      const result = await voteService.voteStatus({}, videoId)

      expect(result).toBe(action)
      expect(voteModel.findOne).toHaveBeenCalledWith({ video: videoId })
    })
  })

  describe('getTotalThumbsByVideoId', () => {
    it('should return the total number of thumbs up and thumbs down for the given video', async () => {
      const videoId = '123'
      const thumbsUpCount = 5
      const thumbsDownCount = 3
      jest.fn().mockImplementation((query) => {
        if (query.action === VoteActions.THUMBS_UP) {
          return thumbsUpCount
        } else if (query.action === VoteActions.THUMBS_DOWN) {
          return thumbsDownCount
        } else {
          return Promise.reject(new Error('Invalid query'))
        }
      })

      const [totalThumbsUp, totalThumbsDown] =
        await voteService.getTotalThumbsByVideoId(videoId)

      expect(totalThumbsUp).toBe(thumbsUpCount)
      expect(totalThumbsDown).toBe(thumbsDownCount)
      expect(voteModel.count).toHaveBeenCalledTimes(2)
      expect(voteModel.count).toHaveBeenCalledWith({
        video: videoId,
        action: VoteActions.THUMBS_UP,
      })
      expect(voteModel.count).toHaveBeenCalledWith({
        video: videoId,
        action: VoteActions.THUMBS_DOWN,
      })
    })
  })

  describe('remove', () => {
    const userId = 'user123'
    const videoId = 'video123'

    it('should remove the vote with the given user and video IDs', async () => {
      const removeResult = { deletedCount: 1 }
      jest.fn().mockResolvedValueOnce(removeResult)

      const result = await voteService.remove(userId, videoId)

      expect(result).toEqual(removeResult)
      expect(voteModel.findOneAndRemove).toHaveBeenCalledWith({
        user: userId,
        video: videoId,
      })
    })
  })
})
