import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
      expiresIn: process.env.EXPIRES_IN,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(Number(payload.id));

    if (!user) {
      throw new UnauthorizedException('No permissino');
    }

    return {
      id: user.id,
    };
  }
}
