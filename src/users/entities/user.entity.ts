import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { ImageEntity } from 'src/images/entities/image.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  password_hash?: string;

  @Column()
  password_salt?: string;

  @OneToMany(() => ActivityEntity, (activity) => activity.activity_creator)
  created_events: Array<ActivityEntity>;
}
