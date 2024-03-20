import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Muscle } from '~/modules/muscle/entities/muscle.entity';

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
  info: string;

  @Column({ nullable: true })
  tutorialUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
