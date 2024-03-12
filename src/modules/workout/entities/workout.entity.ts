import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '~/modules/users/entities/user.entity';

@Entity('workouts')
@Unique(['userId', 'name'])
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ default: true })
  isPrivate: boolean;

  @Column({ default: false })
  isRoutine: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
