import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn()
  activity_id: number;

  @Column()
  activity_name?: string;

  @Column()
  activity_duration?: number;

  @Column()
  activity_location?: string;

  @Column()
  activity_type: string;

  @Column()
  activity_participants: string;

  @Column()
  activity_rating?: number;

  @Column()
  activity_notes?: string;

  @Column()
  activity_date?: string;

  @Column()
  activity_cost?: string;
}
