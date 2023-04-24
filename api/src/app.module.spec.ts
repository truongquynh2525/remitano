import { Test } from '@nestjs/testing'
import { AppModule } from './app.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/users/user.module'
import { VideoModule } from '@modules/videos/video.module'
import { VoteModule } from '@modules/votes/vote.module'

describe('AppModule', () => {
  let app

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI),
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(app).toBeDefined()
  })

  it('should have AuthModule', () => {
    const authModule = app.get(AuthModule)
    expect(authModule).toBeDefined()
  })

  it('should have UserModule', () => {
    const userModule = app.get(UserModule)
    expect(userModule).toBeDefined()
  })

  it('should have VideoModule', () => {
    const videoModule = app.get(VideoModule)
    expect(videoModule).toBeDefined()
  })

  it('should have VoteModule', () => {
    const voteModule = app.get(VoteModule)
    expect(voteModule).toBeDefined()
  })

  it('should have ConfigService', () => {
    const configService = app.get(ConfigService)
    expect(configService).toBeDefined()
  })
})
