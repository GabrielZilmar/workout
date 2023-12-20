import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '~/modules/users/entities/user.entity';

export type TokenTypes = 'LOGIN' | 'RECOVER_PASSWORD' | 'EMAIL_AUTH';
export const TokenTypeMap: Record<TokenTypes, TokenTypes> = {
  LOGIN: 'LOGIN',
  RECOVER_PASSWORD: 'RECOVER_PASSWORD',
  EMAIL_AUTH: 'EMAIL_AUTH',
};
export const TOKEN_TYPES_ENUM = Object.values(TokenTypeMap);

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ enum: TOKEN_TYPES_ENUM })
  type: TokenTypes;

  @Column()
  token: string;

  @Column({ type: 'timestamptz' })
  expiry: Date;

  @Column({ type: 'timestamptz', nullable: true })
  usedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
