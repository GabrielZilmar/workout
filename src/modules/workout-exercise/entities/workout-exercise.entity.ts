import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from '~/modules/exercise/entities/exercise.entity';
import { Workout } from '~/modules/workout/entities/workout.entity';

@Entity('workout-exercises')
export class WorkoutExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Workout)
  workout: Workout;

  @Column({ type: 'uuid' })
  workoutId: string;

  @ManyToOne(() => Exercise)
  exercise: Exercise;

  @Column({ type: 'uuid' })
  exerciseId: string;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
