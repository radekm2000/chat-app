import { Request } from 'express';
import { User } from '../entities/user.entity';
import { Message } from '../entities/message.entity';

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
  user?: User;
}

export type CreateMessageParams = {
  content: string;
  author: User;
};

export type CreateMessageResponse = {
  message: Message;
};

export type CreateConversationParams = {
  message: string;
  username: string;
};
