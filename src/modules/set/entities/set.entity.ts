import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Collection of repetitions and weight
@Entity('sets')
export class Set {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: Workout exercise N_N table
  // @ManyToOne(() => Muscle)
  // @JoinColumn()
  // workoutExerciseId: Muscle;
  @Column()
  muscleId: string;

  @Column({ default: 0 })
  numDrops: number;

  @Column({ default: 0 })
  numReps: number;

  @Column({ default: 0 })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
