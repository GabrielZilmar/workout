import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from '~/modules/exercise/entities/exercise.entity';

export type Languages = 'PORTUGUESE' | 'SPANISH';
export const LanguageMap: Record<Languages, Languages> = {
  PORTUGUESE: 'PORTUGUESE',
  SPANISH: 'SPANISH',
};
export const LANGUAGE_ENUM = Object.values(LanguageMap);

@Entity('exercise_translations')
@Unique(['exerciseId', 'language'])
export class ExerciseTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  info: string | null;

  @Column({
    type: 'enum',
    enum: LANGUAGE_ENUM,
  })
  language: Languages;

  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  exercise: Exercise;

  @Column({ type: 'uuid' })
  exerciseId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
