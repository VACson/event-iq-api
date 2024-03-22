import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn()
  activity_id: number;

  @Column()
  activity_name: string;

  @Column({ nullable: true })
  activity_creator_id: string;

  @Column({ nullable: true })
  activity_duration: number;

  @Column({ nullable: true })
  activity_location: string;

  @Column({ nullable: true })
  activity_type: string;

  @Column({ default: 0 })
  activity_participants: number;

  @Column({ nullable: true })
  activity_rating: number;

  @Column({ default: '' })
  activity_notes: string;

  @Column({ nullable: true })
  activity_date: string;

  @Column({ default: 0 })
  activity_cost: number;
}
