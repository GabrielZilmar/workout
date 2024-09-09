import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Muscle } from '~/modules/muscle/entities/muscle.entity';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Muscle)
  @JoinColumn()
  muscle: Muscle;

  @Column()
  muscleId: string;

  @Column({ nullable: true, type: 'text' })
  info: string | null;

  @Column({ type: String, nullable: true })
  tutorialUrl: string | null;

  @OneToMany(
    () => WorkoutExercise,
    (workoutExercise) => workoutExercise.exercise,
  )
  workoutExercises: WorkoutExercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
