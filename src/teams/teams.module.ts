import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { UsersModule } from 'src/users/users.module';
import { TeamsEntity } from './entities/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [TypeOrmModule.forFeature([TeamsEntity]), UsersModule],
  exports: [TeamsService],
})
export class TeamsModule {}
