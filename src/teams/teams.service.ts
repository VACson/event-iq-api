import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll({ limit = 10, offset = 0 } = {}): Promise<{
    results: TeamsEntity[];
    count: number;
  }> {
    const results = await this.teamsRepository.find({
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
          uuid: true,
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

    const count = await this.teamsRepository.count();

    return { results, count };
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

  async addNewMember(uuid: string, userUuid: string) {
    const team = await this.findOne(uuid);
    const user = await this.usersService.findById(userUuid);

    if (!team || !user) {
      throw new NotFoundException('Team or user not found');
    }

    const isCreator = team.creator.username === user.username;

    if (isCreator) {
      throw new ConflictException('User is creator of the team');
    }

    const isMember = team.members.some(
      (member) => member.username === user.username,
    );

    if (isMember) {
      throw new ConflictException('User is already a member of the team');
    }

    team.members.push(user);

    await this.teamsRepository.save({
      uuid,
      name: team.name,
      description: team.description,
      avatar: team.avatar,
      members: team.members,
    });

    return this.findOne(uuid);
  }

  remove(uuid: string) {
    return this.teamsRepository.delete({ uuid });
  }
}
