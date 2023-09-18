import { Request } from 'express';
import { User } from '../entities/user.entity';

export type CreateUserDetails = {
  username: string;
  password: string;
};

export type FindUserParams = Partial<{
  username: string;
  id: number;
}>;

export type LoginUserParams = {
  username: string;
  password: string;
};

export interface CustomRequest extends Request {
  user: User;
}
