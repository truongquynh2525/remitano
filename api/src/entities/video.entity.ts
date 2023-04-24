import { Prop } from '@nestjs/mongoose'
import { HydratedDocument, Schema } from 'mongoose'
import { Schema as SchemaFactory } from '@nestjs/mongoose'
import { User } from './user.entity'

export type VideoDocument = HydratedDocument<Video>

@SchemaFactory()
export class Video {
  @Prop()
  videoUrl: string

  @Prop({ type: Schema.Types.ObjectId, ref: 'User' })
  user: Schema.Types.ObjectId | User
}

export const VideoSchema = new Schema({
  videoUrl: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
})
