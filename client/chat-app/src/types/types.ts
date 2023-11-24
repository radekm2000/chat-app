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
  username: string;
};
export type ChatMessage = {
  id: number;
  content: string;
  createdAt: string;
  author: MessageAuthor;
};

export type ConversationUser = {
  id: number;
  username: string;
};

export type Conversation = {
  id: number;
  createdAt: string;
  lastMessageSentAt: string;
  author: ConversationUser;
  recipient: ConversationUser;
};
export type UserType = {
  id: number;
  username: string;
  messages: [];
};

export type LastMessageSent = {
  id: number;
  content: string;
  createdAt: string;
};

export type SendFriendRequest = {
  userId: number;
  username: string;
};

export type UserSearchbarResponseWindow = {
  username: string;
  id: number;
  avatar: string | null;
};

export type Person = {
  id: number;
  username: string;
};

export type FriendRequest = {
  createdAt: string;
  id: number;
  receiver: Person;
  sender: Person;
};

export type Friendship = {
  id: number;
  sender: Person;
  receiver: Person;
};
