import { ImageEntity } from 'src/images/entities/image.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
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

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => UserEntity, (user) => user.created_events)
  creator: UserEntity;

  @JoinTable()
  @ManyToMany(() => UserEntity, (user) => user.joined_events)
  members: UserEntity[];
}
