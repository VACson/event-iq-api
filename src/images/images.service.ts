import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileType, ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private imagesRepository: Repository<ImageEntity>,
  ) {}
  create(file: Express.Multer.File, userUuid: string) {
    return this.imagesRepository.save({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { uuid: userUuid },
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
}
