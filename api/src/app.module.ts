import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule, VideoModule, VoteModule } from './modules'
import { AuthModule } from '@modules/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UserModule,
    VideoModule,
    VoteModule,
  ],
})
export class AppModule {}
