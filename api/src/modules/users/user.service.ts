import { CreateUserDto } from '@dto'
import { User } from '@entities'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { hashSync } from 'bcrypt'
import { SALT } from '@constants'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = hashSync(createUserDto.password, SALT)

    const createdUser = new this.userModel({ ...createUserDto, password: hash })

    return createdUser.save()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec()
  }

  async remove(username: string): Promise<User> {
    return this.userModel.findOneAndRemove({ username }).exec()
  }
}
