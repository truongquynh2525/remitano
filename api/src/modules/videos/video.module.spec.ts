import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema, Video, VideoSchema } from '@entities'
import { VideoController } from './video.controller'
import { VideoService } from './video.service'
import { VideoModule } from './video.module'

describe('VideoModule', () => {
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/nest', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        MongooseModule.forFeature([
          { name: Video.name, schema: VideoSchema },
          { name: User.name, schema: UserSchema },
        ]),
        VideoModule,
      ],
      controllers: [VideoController],
      providers: [VideoService],
    }).compile()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    const app = module.createNestApplication()
    expect(app).toBeDefined()
  })
})
