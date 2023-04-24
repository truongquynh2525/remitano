import { HydratedDocument, Schema } from 'mongoose'
import { Schema as SchemaFactory } from '@nestjs/mongoose'
import { Video, User } from '@entities'
import { Prop } from '@nestjs/mongoose'
import { VoteActions } from '@constants'

export type VoteDocument = HydratedDocument<Vote>

@SchemaFactory()
export class Vote {
  @Prop({ enum: VoteActions })
  action: string

  @Prop({ type: Schema.Types.ObjectId, ref: 'Video' })
  video: Schema.Types.ObjectId | Video

  @Prop({ type: Schema.Types.ObjectId, ref: 'User' })
  user: Schema.Types.ObjectId | User
}

export const VoteSchema = new Schema({
  action: String,
  video: { type: Schema.Types.ObjectId, ref: 'Video' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
})
