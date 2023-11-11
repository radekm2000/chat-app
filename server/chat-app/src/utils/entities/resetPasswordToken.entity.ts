import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ResetPasswordToken {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column()
  token: string;

  @OneToOne((type) => User, (user) => user, {
    cascade: ['insert', 'remove', 'update'],
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: User;
}
