import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register(dto: CreateUserDto) {
    try {
      const { uuid, password, ...userData } =
        await this.usersService.create(dto);
      return {
        ...userData,
        token: this.jwtService.sign({ uuid }),
      };
    } catch (e) {
      throw new ForbiddenException('Register failed');
    }
  }

  async login(user: UserEntity) {
    return {
      token: this.jwtService.sign({ uuid: user.uuid }),
      email: user.email,
      fullname: user.fullname,
    };
  }
}
