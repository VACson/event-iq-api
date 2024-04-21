import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ActivitiesService } from 'src/activities/activities.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private imagesRepository: Repository<ImageEntity>,
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
  ) {}

  async create(file: Express.Multer.File, userUuid: string) {
    const user = await this.usersService.findById(userUuid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.imagesRepository.save({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: user,
    });
  }

  findAll(userUuid: string) {
    const qb = this.imagesRepository.createQueryBuilder('image');

    qb.where('image.userUuid = :userUuid', { userUuid });

    qb.andWhere('image.mimetype ILIKE :type', { type: '%image%' });

    return qb.getMany();
  }

  async remove(userUuid: string, uuid: string) {
    const qb = this.imagesRepository.createQueryBuilder('image');

    qb.where('uuid = :uuid AND userUuid = :userUuid', {
      uuid,
      userUuid,
    });

    return qb.softDelete().execute();
  }

  async updateAvatar(file: Express.Multer.File, userUuid: string) {
    const user = await this.usersService.findById(userUuid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const image = this.imagesRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: user,
    });

    await this.imagesRepository.save(image);

    const result = await this.usersService.updateUserAvatar(userUuid, image);

    return result;
  }

  async uploadEventImage(file: Express.Multer.File, activityUuid: string) {
    const event = await this.activitiesService.findById(activityUuid);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const image = this.imagesRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      event: event,
    });

    await this.imagesRepository.save(image);

    const result = await this.activitiesService.addActivityImage(
      activityUuid,
      image,
    );

    return result;
  }
}
