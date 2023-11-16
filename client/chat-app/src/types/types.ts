export type RegisterInput = {
  username: string;
  password: string;
  email: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
};

export type SearchBarResponse = {
  users: User[] | User | undefined;
};

export type FindUserParams = {
  id?: number;
};

export type CreateConversationParams = {
  username: string;
  message?: string;
};

export type OnlineUser = {
  userId: number;
  socketId: string;
};

export type Notification = {
  isRead: boolean;
  date: Date;
  senderId: number;
};

export type SendEmailToResetPasswordResponse = {
  message: string;
};

export type ChangePasswordProp = {
  params: ChangePasswordParams;
};
export type ChangePasswordParams = {
  token: string;
  userId: string;
};

export type ChangePasswordCredentials = {
  password: string;
  confirmPassword: string;
  token: string;
  userId: number;
};

export type Recipient = {
  username: string;
  lastMessageSent: Message;
  lastMessageSentAt: string;
  id: string;
  avatar: string;
};
export type Message = {
  id: string;
  content: string;
  createdAt: string;
};

export type MessageAuthor = {
  id: number;
  email: string;
};
export type ChatMessage = {
  id: number;
  content: string;
  createdAt: string;
  author: MessageAuthor;
};
