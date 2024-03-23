import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from 'src/images/entities/image.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    return this.userRepository.save(dto);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(uuid: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ uuid });
  }

  async update(uuid: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, dto);

    return this.userRepository.save(user);
  }

  async updateUserAvatar(
    uuid: string,
    image: ImageEntity,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.avatar = image.filename;
    return this.userRepository.save(user);
  }
}
