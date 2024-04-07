import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsEntity } from './entities/team.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamsEntity)
    private teamsRepository: Repository<TeamsEntity>,
    private usersService: UsersService,
  ) {}

  async create(userUuid: string, createTeamDto: CreateTeamDto) {
    const user = await this.usersService.findById(userUuid);

    return this.teamsRepository.save({
      ...createTeamDto,
      creator: user,
    });
  }

  findAll({ limit = 10, offset = 0 } = {}) {
    return this.teamsRepository.find({
      relations: {
        creator: true,
        members: true,
      },
      select: {
        uuid: true,
        description: true,
        avatar: true,
        creator: {
          username: true,
          description: true,
          avatar: true,
        },
        members: {
          username: true,
          description: true,
          avatar: true,
        },
      },
      take: limit,
      skip: offset,
    });
  }

  findOne(uuid: string) {
    return this.teamsRepository.findOne({
      relations: {
        creator: true,
        members: true,
      },
      select: {
        uuid: true,
        name: true,
        description: true,
        avatar: true,
        creator: {
          username: true,
          description: true,
          avatar: true,
        },
        members: {
          username: true,
          description: true,
          avatar: true,
        },
      },
      where: { uuid },
    });
  }

  async update(uuid: string, updateTeamDto: UpdateTeamDto) {
    await this.teamsRepository.update({ uuid }, updateTeamDto);
    return this.findOne(uuid);
  }

  remove(uuid: string) {
    return this.teamsRepository.delete({ uuid });
  }
}
