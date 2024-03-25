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
  activity_uuid: string;

  @Column()
  activity_name: string;

  @ManyToOne(() => UserEntity, (user) => user.created_events)
  activity_creator: UserEntity;

  @Column({ nullable: true })
  activity_duration: number;

  @Column({ nullable: true })
  activity_category: string;

  @Column({ default: 0 })
  activity_participants: number;

  @Column({ default: '' })
  activity_notes: string;

  @Column({ nullable: true })
  activity_placement: string;

  @Column({ default: 0 })
  activity_views: number;

  @OneToMany(() => ImageEntity, (image) => image.event)
  activity_images: Array<ImageEntity>;
}
