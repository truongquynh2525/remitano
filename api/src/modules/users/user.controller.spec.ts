import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { CreateUserDto } from '@dto'
import { User } from '@entities'
import { AuthGuard } from '@guards'
import { JwtService } from '@nestjs/jwt'

describe('UserController', () => {
  let controller: UserController
  let service: UserService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        { username: 'user1', password: 'pass1' },
        { username: 'user2', password: 'pass2' },
      ]

      jest.spyOn(service, 'findAll').mockResolvedValue(users)

      expect(await controller.findAll()).toBe(users)
    })
  })

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const user: User = { username: 'testuser', password: 'password' }

      jest.spyOn(service, 'findOne').mockResolvedValue(user)

      expect(await controller.findOne(user.username)).toBe(user)
    })
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
      }
      const user: User = { ...createUserDto }

      jest.spyOn(service, 'create').mockResolvedValue(user)

      expect(await controller.create(createUserDto)).toBe(user)
    })
  })

  describe('remove', () => {
    it('should remove a user by username', async () => {
      const username = 'testuser'
      const user: User = { username, password: 'password' }

      jest.spyOn(service, 'remove').mockResolvedValue(user)

      expect(await controller.remove(username)).toBe(user)
    })
  })

  describe('guards', () => {
    it('should use the AuthGuard for findOne and remove', () => {
      const authGuard: AuthGuard = new AuthGuard(jwtService)

      const findOneMetadatas = Reflect.getMetadataKeys(
        UserController.prototype,
        'findOne',
      )

      expect(findOneMetadatas).toContain('guards')

      const findOneGuard = Reflect.getMetadata(
        'guards',
        UserController.prototype,
        'findOne',
      )

      expect(findOneGuard).toContainEqual(authGuard)

      const removeMetadatas = Reflect.getMetadataKeys(
        UserController.prototype,
        'remove',
      )

      expect(removeMetadatas).toContain('guards')

      const removeGuard = Reflect.getMetadata(
        'guards',
        UserController.prototype,
        'remove',
      )

      expect(removeGuard).toContainEqual(authGuard)
    })
  })
})
