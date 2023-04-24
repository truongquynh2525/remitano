import { ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthGuard } from './auth.guard'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from '@constants'
import { UnauthorizedException } from '@nestjs/common'

describe('AuthGuard', () => {
  let authGuard: AuthGuard
  let jwtService: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ userId: 'user123' }),
          },
        },
      ],
    }).compile()

    authGuard = moduleRef.get<AuthGuard>(AuthGuard)
    jwtService = moduleRef.get<JwtService>(JwtService)
  })

  describe('canActivate', () => {
    it('should return true if the token is valid', async () => {
      const request: any = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      }
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as ExecutionContext

      const canActivate = await authGuard.canActivate(context)

      expect(canActivate).toBe(true)
      expect(request.user).toEqual({ userId: 'user123' })
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: jwtConstants.secret,
      })
    })

    it('should throw an UnauthorizedException if the token is invalid', async () => {
      const request: any = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      }
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as ExecutionContext

      ;(jwtService.verifyAsync as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid token'),
      )

      try {
        await authGuard.canActivate(context)
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
        expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalid-token', {
          secret: jwtConstants.secret,
        })
      }
    })

    it('should throw an UnauthorizedException if the token is missing', async () => {
      const request: any = {}
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as ExecutionContext

      try {
        await authGuard.canActivate(context)
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
        expect(jwtService.verifyAsync).not.toHaveBeenCalled()
      }
    })
  })
})
