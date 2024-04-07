import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('teams')
export class TeamsEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  avatar?: string;

  @ManyToOne(() => UserEntity, (user) => user.created_teams)
  creator: UserEntity;

  @JoinTable()
  @ManyToMany(() => UserEntity, (user) => user.joined_teams)
  members: UserEntity[];
}
