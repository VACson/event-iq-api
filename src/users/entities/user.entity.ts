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

  @Column({ select: false })
  password_hash?: string;

  @Column({ select: false })
  password_salt?: string;

  @OneToMany(() => ActivityEntity, (activity) => activity.creator)
  created_events: Array<ActivityEntity>;

  @ManyToMany(() => ActivityEntity, (activity) => activity.members)
  joined_events?: Array<ActivityEntity>;

  @OneToMany(() => TeamsEntity, (team) => team.creator)
  created_teams: Array<TeamsEntity>;

  @ManyToMany(() => TeamsEntity, (team) => team.members)
  joined_teams: Array<TeamsEntity>;
}
