import { Prop, Schema as SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@SchemaFactory()
export class User {
  @Prop()
  username: string

  @Prop()
  password: string
}

export const UserSchema = new Schema({
  username: String,
  password: String,
})
