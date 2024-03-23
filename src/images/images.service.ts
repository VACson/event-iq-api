import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileType, ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private imagesRepository: Repository<ImageEntity>,
    private usersService: UsersService,
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
}
