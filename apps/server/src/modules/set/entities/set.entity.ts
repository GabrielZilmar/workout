import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';

@Entity('sets')
export class Set {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkoutExercise, { onDelete: 'CASCADE' })
  workoutExercise: WorkoutExercise;

  @Column({ type: 'uuid' })
  workoutExerciseId: string;

  @Column({ default: 0, type: 'integer' })
  numReps: number;

  @Column({ default: 0, type: 'integer' })
  weight: number;

  @Column({ default: 0, type: 'integer' })
  numDrops: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
