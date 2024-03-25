import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hash = await bcrypt.hash(password, user.password_salt);

    if (user && user.password_hash === hash) {
      const { password_hash, password_salt, ...result } = user;
      return result;
    }

    return null;
  }

  async register(dto: CreateUserDto) {
    try {
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(dto.password, passwordSalt);

      const userData = {
        email: dto.email,
        username: dto.username,
        password_hash: passwordHash,
        password_salt: passwordSalt,
        created_at: new Date(),
      };

      const { password_hash, password_salt, ...user } =
        await this.usersService.create(userData);
      return {
        ...user,
        token: this.jwtService.sign({ uuid: user.uuid }),
      };
    } catch (e) {
      throw new ForbiddenException('Register failed');
    }
  }

  async login(user: UserEntity) {
    return {
      token: this.jwtService.sign({ uuid: user.uuid }),
      ...user,
    };
  }
}
