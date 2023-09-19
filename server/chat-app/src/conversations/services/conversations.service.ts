/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { IConversationService } from '../interfaces/conversations.interface';
import { Conversation } from 'src/utils/entities/conversation.entity';
import { User } from 'src/utils/entities/user.entity';
import { CreateConversationParams } from 'src/utils/types/types';

@Injectable()
export class ConversationsService implements IConversationService {
  createConversation(
    user: User,
    conversationParams: CreateConversationParams,
  ): Promise<Conversation> {
    return;
  }

  getConversations(userId: number): Promise<Conversation[]> {
    return;
  }

  save(conversation: Conversation): void {
    return;
  }
}
