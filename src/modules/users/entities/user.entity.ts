import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true }) // Missing
  email: string;

  @Column()
  password: string;

  @Column({ default: false }) // Missing
  isEmailVerified: boolean;

  @Column({ default: false }) // Missing
  isAdmin: boolean;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  weight?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({ type: 'timestamptz', nullable: true }) // Missing
  deletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
