import { Test } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { VoteController } from './vote.controller'
import { VoteService } from './vote.service'
import { Vote, VoteSchema } from '@entities'
import { Model } from 'mongoose'

describe('VoteModule', () => {
  let voteController: VoteController
  let voteService: VoteService
  let voteModel: Model<Vote>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test', {
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
      ],
      controllers: [VoteController],
      providers: [VoteService],
    }).compile()

    voteController = moduleRef.get<VoteController>(VoteController)
    voteService = moduleRef.get<VoteService>(VoteService)
  })

  afterEach(async () => {
    await voteModel.deleteMany({})
  })

  describe('VoteController', () => {
    it('should be defined', () => {
      expect(voteController).toBeDefined()
    })
  })

  describe('VoteService', () => {
    it('should be defined', () => {
      expect(voteService).toBeDefined()
    })
  })
})
