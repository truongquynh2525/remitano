import { Test } from '@nestjs/testing'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserModule } from '..'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

describe('AuthModule', () => {
  let authService: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        JwtModule.register({
          global: true,
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile()

    authService = moduleRef.get<AuthService>(AuthService)
    jwtService = moduleRef.get<JwtService>(JwtService)
  })

  describe('AuthService', () => {
    it('should be defined', () => {
      expect(authService).toBeDefined()
    })
  })

  describe('JwtService', () => {
    it('should be defined', () => {
      expect(jwtService).toBeDefined()
    })
  })
})
