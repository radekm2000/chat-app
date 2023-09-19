import { Conversation } from 'src/utils/entities/conversation.entity';
import { User } from 'src/utils/entities/user.entity';
import { CreateConversationParams } from 'src/utils/types/types';

export interface IConversationService {
  createConversation(
    user: User,
    conversationParams: CreateConversationParams,
  ): Promise<Conversation>;

  getConversations(userId: number): Promise<Conversation[]>;
  save(conversation: Conversation): void;
}
