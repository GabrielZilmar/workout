import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from '~/modules/exercise/entities/exercise.entity';
import { Set } from '~/modules/set/entities/set.entity';
import { Workout } from '~/modules/workout/entities/workout.entity';

@Entity('workout_exercises')
export class WorkoutExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Workout, { onDelete: 'CASCADE' })
  workout: Workout;

  @Column({ type: 'uuid' })
  workoutId: string;

  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  exercise: Exercise;

  @Column({ type: 'uuid' })
  exerciseId: string;

  @Column({ type: 'integer', nullable: true })
  order: number | null;

  @OneToMany(() => Set, (set) => set.workoutExercise)
  sets: Set[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
