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
    const message = this.messageRepository.create({
      content,
      author: author,
      conversation,
    });
    const savedMessage = await this.messageRepository.save(message);
    conversation.lastMessageSent = savedMessage;
    const updatedConversation =
      await this.conversationRepository.save(conversation);
    return { message: savedMessage, updatedConversation };
  }

  getMessages(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: {
        author: {
          id: userId,
        },
      },
    });
  }
}
