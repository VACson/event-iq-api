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

  async create(dto) {
    return this.userRepository.save(dto);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(uuid: string): Promise<UserEntity> {
    const response = await this.userRepository.findOne({
      where: { uuid },

      relations: {
        created_events: true,
        joined_events: true,
        created_teams: true,
        joined_teams: true,
      },

      select: {
        uuid: true,
        email: true,
        username: true,
        description: true,
        avatar: true,
        created_events: true,
        joined_events: true,
        created_teams: true,
        joined_teams: true,
      },
    });

    if (!response) {
      throw new NotFoundException('User not found');
    }

    return response;
  }

  async update(uuid: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);

    await this.userRepository.save(user);

    return this.findById(uuid);
  }

  async updateUserAvatar(
    uuid: string,
    image: ImageEntity,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ uuid });

    if (!user) throw new NotFoundException('User not found');

    user.avatar = image.filename;
    await this.userRepository.save(user);

    return this.findById(uuid);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
