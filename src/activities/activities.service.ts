import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { ImageEntity } from 'src/images/entities/image.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityEntity)
    private activityRepository: Repository<ActivityEntity>,
    private usersService: UsersService,
  ) {}

  async create(userUuid: string, createActivityDto: CreateActivityDto) {
    const user = await this.usersService.findById(userUuid);

    return this.activityRepository.save({
      ...createActivityDto,
      creator: user,
    });
  }

  async findAll({ limit = 10, offset = 0, userUuid = '' } = {}): Promise<{
    results: any;
    count: number;
    userUuid?: string;
  }> {
    const results = await this.activityRepository.find({
      relations: {
        creator: true,
        members: true,
      },
      select: {
        uuid: true,
        name: true,
        description: true,
        location: true,
        views: true,
        creator: {
          uuid: true,
          username: true,
          avatar: true,
        },
        image: true,
      },
      take: limit,
      skip: offset,
    });

    const enhancedResults = results.map((activity) => {
      const memberCount = activity.members.length;

      const isJoined =
        activity.members.some((member) => member.uuid === userUuid) ||
        activity.creator.uuid === userUuid;

      const { members, ...activityWithoutMembers } = activity;

      return {
        ...activityWithoutMembers,
        member_count: memberCount,
        is_joined: isJoined,
        userUuid,
      };
    });

    const count = await this.activityRepository.count();

    return { results: enhancedResults, count };
  }

  async findUserCreatedEvents(userUuid: string): Promise<ActivityEntity[]> {
    const user = await this.usersService.findById(userUuid);

    return this.activityRepository.find({ where: { creator: user } });
  }

  async findById({
    uuid,
    userUuid = '',
  }: {
    uuid: string;
    userUuid?: string;
  }): Promise<any> {
    const activity = await this.activityRepository.findOne({
      where: { uuid },
      relations: {
        creator: true,
        members: true,
      },
      select: {
        uuid: true,
        name: true,
        description: true,
        location: true,
        views: true,
        creator: {
          uuid: true,
          username: true,
          description: true,
          avatar: true,
        },
        members: {
          uuid: true,
          username: true,
          description: true,
          avatar: true,
        },
        image: true,
      },
    });

    const memberCount = activity.members.length;

    const isJoined =
      activity.members.some((member) => member.uuid === userUuid) ||
      activity.creator.uuid === userUuid;

    return {
      ...activity,
      member_count: memberCount,
      is_joined: isJoined,
    };
  }

  async update(uuid: string, dto: UpdateActivityDto): Promise<ActivityEntity> {
    const activity = await this.activityRepository.findOneBy({ uuid });

    if (!activity) {
      throw new NotFoundException('Event not found');
    }

    Object.assign(activity, dto);

    return this.activityRepository.save(activity);
  }

  async addActivityImage(
    uuid: string,
    image: ImageEntity,
  ): Promise<ActivityEntity> {
    const activity = await this.activityRepository.findOne({
      where: { uuid },
      relations: ['images'],
    });

    if (!activity) {
      throw new NotFoundException('User not found');
    }

    activity.image = image.filename;
    return this.activityRepository.save(activity);
  }

  async addNewMember(uuid: string, userUuid: string) {
    const activity = await this.activityRepository.findOneBy({ uuid });
    const user = await this.usersService.findById(userUuid);

    if (!activity || !user) {
      throw new NotFoundException('Team or user not found');
    }

    const isCreator = activity?.creator?.uuid === userUuid;

    if (isCreator) {
      throw new ConflictException('User is creator of the activity');
    }

    const isMember = activity.members?.some(
      (member) => member.username === user.username,
    );

    if (isMember) {
      throw new ConflictException('User is already a member of the activity');
    }

    activity.members.push(user);

    await this.activityRepository.save({
      uuid,
      name: activity.name,
      description: activity.description,
      image: activity.image,
      members: activity.members,
    });

    return this.findById({ uuid, userUuid });
  }

  remove(uuid: string) {
    return this.activityRepository.delete({ uuid });
  }
}
