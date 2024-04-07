import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { TeamsEntity } from 'src/teams/entities/team.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
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

  @ManyToMany(() => TeamsEntity, (team) => team.creator)
  created_teams?: Array<TeamsEntity>;

  @ManyToMany(() => TeamsEntity, (team) => team.members)
  joined_teams?: Array<TeamsEntity>;
}
