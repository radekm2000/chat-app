import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IMessageService } from '../interfaces/messages.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/utils/entities/message.entity';
import { Repository } from 'typeorm';
import {
  CreateMessageParams,
  CreateMessageResponse,
} from 'src/utils/types/types';
import { UsersService } from 'src/users/services/users.service';
import { ConversationsService } from 'src/conversations/services/conversations.service';
import { Conversation } from 'src/utils/entities/conversation.entity';

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private userService: UsersService,
    private conversationService: ConversationsService,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}

  async createMessage(
    params: CreateMessageParams,
  ): Promise<CreateMessageResponse> {
    const { content, author, conversationId } = params;
    const conversation =
      await this.conversationService.findById(conversationId);
    if (!conversation) {
      throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);
    }

    console.log('id konwersacji', conversationId);
    console.log('znaleziona konwersacja');
    console.log(conversation);
    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author,
    });

    const savedMessage = await this.messageRepository.save(newMessage);
    console.log('saved message');
    console.log(savedMessage);
    conversation.lastMessageSent = savedMessage;
    const updatedConversation =
      await this.conversationRepository.save(conversation);
    return { message: newMessage, updatedConversation };
  }

  async getMessagesByConversationId(
    conversationId: number,
  ): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      relations: ['author'],
      where: {
        conversation: {
          id: conversationId,
        },
      },
      order: { createdAt: 'ASC' },
    });
    return messages;
  }

  getMessages(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: {
        author: {
          id: userId,
        },
      },
      relations: ['author', 'conversation'],
    });
  }
}
