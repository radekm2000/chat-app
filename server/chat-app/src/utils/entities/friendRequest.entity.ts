import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendRequestStatus } from '../types/types';
import { User } from './user.entity';

@Entity({ name: 'friend_requests' })
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: User;

  @CreateDateColumn()
  createdAt: number;

  @Column()
  status: FriendRequestStatus;
}
