import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LoginDto } from '@dto'
import { UnauthorizedException } from '@nestjs/common'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile()

    authService = moduleRef.get<AuthService>(AuthService)
    authController = moduleRef.get<AuthController>(AuthController)
  })

  describe('login', () => {
    it('should return access token if username and password are valid', async () => {
      const mockUser = { username: 'johndoe', password: 'password' }
      jest.spyOn(authService, 'signIn').mockResolvedValueOnce({
        access_token: 'mock-access-token',
      })

      const loginDto: LoginDto = {
        username: mockUser.username,
        password: mockUser.password,
      }
      const result = await authController.login(loginDto)

      expect(result).toEqual({ access_token: 'mock-access-token' })
    })

    it('should throw UnauthorizedException if invalid username and password are provided', async () => {
      const mockUser = { username: 'johndoe', password: 'password' }
      jest.spyOn(authService, 'signIn').mockImplementation(() => {
        throw new UnauthorizedException()
      })

      const loginDto: LoginDto = {
        username: mockUser.username,
        password: 'wrong-password',
      }
      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })

  describe('getProfile', () => {
    it('should return user profile if authenticated', () => {
      const mockUser = { id: 1, username: 'johndoe' }
      const request = { user: mockUser }
      const result = authController.getProfile(request)

      expect(result).toEqual(mockUser)
    })
  })
})
