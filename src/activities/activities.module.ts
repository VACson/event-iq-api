import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from './entities/activity.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  imports: [TypeOrmModule.forFeature([ActivityEntity]), UsersModule],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
