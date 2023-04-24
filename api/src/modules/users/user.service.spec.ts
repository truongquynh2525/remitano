import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserService } from './user.service'
import { User } from '@entities'
import { CreateUserDto } from '@dto'
import { hashSync } from 'bcrypt'

describe('UserService', () => {
  let service: UserService
  let userModel: Model<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndRemove: jest.fn(),
            exec: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    userModel = module.get<Model<User>>(getModelToken(User.name))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password',
    }

    it('should create a new user', async () => {
      const hash = hashSync(createUserDto.password, 10)
      const createdUser = {
        ...createUserDto,
        password: hash,
        save: jest.fn(),
      }
      jest.fn().mockReturnValue(createdUser)

      const result = await service.create(createUserDto)

      expect(result).toEqual(createdUser)
      expect(userModel).toHaveBeenCalledWith({
        ...createUserDto,
        password: hash,
      })
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        { username: 'testuser1', password: 'password1' },
        { username: 'testuser2', password: 'password2' },
      ]
      jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      })

      const result = await service.findAll()

      expect(result).toEqual(users)
      expect(userModel.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const username = 'testuser'
      const user: User = { username, password: 'password' }
      jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      })

      const result = await service.findOne(username)

      expect(result).toEqual(user)
      expect(userModel.findOne).toHaveBeenCalledWith({ username })
    })
  })

  describe('remove', () => {
    it('should remove a user by username', async () => {
      const username = 'testuser'
      const user: User = { username, password: 'password' }
      jest.fn().mockReturnValue(user)

      const result = await service.remove(username)

      expect(result).toEqual(user)
      expect(userModel.findOneAndRemove).toHaveBeenCalledWith({ username })
    })
  })
})
