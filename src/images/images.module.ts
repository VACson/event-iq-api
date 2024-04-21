import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImageEntity } from './entities/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ActivitiesModule } from 'src/activities/activities.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    UsersModule,
    ActivitiesModule,
    TeamsModule,
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
