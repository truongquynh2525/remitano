import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from '@dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@guards'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.signIn(payload.username, payload.password)
  }
}
