import { UserService } from '@modules/users/user.service'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let jwtService: JwtService

  beforeEach(() => {
    userService = {
      findOne: jest.fn(),
      create: jest.fn(),
    } as any
    jwtService = {
      signAsync: jest.fn(),
    } as any
    authService = new AuthService(userService, jwtService)
  })

  describe('signIn', () => {
    const username = 'test_user'
    const password = 'test_password'
    const user = { _id: '1', username, password }

    it('should create a new user if one does not exist', async () => {
      jest.fn().mockResolvedValueOnce(null)
      jest.fn().mockResolvedValueOnce(user)
      jest.fn().mockResolvedValueOnce('jwt_token')

      const result = await authService.signIn(username, password)

      expect(jest.fn()).toHaveBeenCalledWith(username)
      expect(jest.fn()).toHaveBeenCalledWith({ username, password })
      expect(jest.fn()).toHaveBeenCalledWith({
        userId: user._id,
        username,
      })
      expect(result).toEqual({ access_token: 'jwt_token' })
    })

    it('should throw an UnauthorizedException if the password is incorrect', async () => {
      jest.fn().mockResolvedValueOnce(user)

      await expect(
        authService.signIn(username, 'wrong_password'),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should sign and return a JWT token if the username and password are correct', async () => {
      jest.fn().mockResolvedValueOnce(user)
      jest.fn().mockResolvedValueOnce('jwt_token')

      const result = await authService.signIn(username, password)

      expect(jest.fn()).toHaveBeenCalledWith(username)
      expect(jest.fn()).toHaveBeenCalledWith({
        userId: user._id,
        username,
      })
      expect(result).toEqual({ access_token: 'jwt_token' })
    })
  })
})
