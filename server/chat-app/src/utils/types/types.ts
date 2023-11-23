import { Request } from 'express';
import { User } from '../entities/user.entity';
import { Message } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';

export type CreateUserDetails = {
  username: string;
  password: string;
  email: string;
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
  conversationId: number;
};

export type CreateMessageResponse = {
  message: Message;
  updatedConversation: Conversation;
};

export type CreateConversationParams = {
  message: string;
  username: string;
};

export type AccessParams = {
  id: number;
  userId: number;
};

export type GetConversationMessagesParam = {
  conversationId: number;
};

export type WebsocketUserType = {
  userId: number;
  socketId: string;
};

export type FriendRequestStatus = 'accepted' | 'pending' | 'rejected';
