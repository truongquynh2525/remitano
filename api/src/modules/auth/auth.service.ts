import { UserService } from '@modules/users/user.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    let user = await this.userService.findOne(username)

    if (!user) {
      await this.userService.create({ username, password: pass })
      user = await this.userService.findOne(username)
    }

    if (user && !compareSync(pass, user.password))
      throw new UnauthorizedException()

    const payload = {
      userId: user['_id'],
      username: user?.username ?? username,
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
