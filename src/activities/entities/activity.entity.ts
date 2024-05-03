import { ImageEntity } from 'src/images/entities/image.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: 'Activity' })
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => UserEntity, (user) => user.created_events)
  creator: UserEntity;

  @Column({ nullable: true })
  image: string;
}
