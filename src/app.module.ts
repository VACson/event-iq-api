import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { ActivitiesModule } from './activities/activities.module';
import { ActivityEntity } from './activities/entities/activity.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImagesModule } from './images/images.module';
import { ImageEntity } from './images/entities/image.entity';
import { TeamsModule } from './teams/teams.module';
import { TeamsEntity } from './teams/entities/team.entity';
import { CategoriesModule } from './categories/categories.module';
import { CategoryEntity } from './categories/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        ActivityEntity,
        ImageEntity,
        TeamsEntity,
        CategoryEntity,
      ],
      synchronize: true,
    }),
    UsersModule,
    ActivitiesModule,
    AuthModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ImagesModule,
    TeamsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
