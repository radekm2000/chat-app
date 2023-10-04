/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IConversationService } from '../interfaces/conversations.interface';
import { Conversation } from 'src/utils/entities/conversation.entity';
import { User } from 'src/utils/entities/user.entity';
import { CreateConversationParams } from 'src/utils/types/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Message } from 'src/utils/entities/message.entity';

@Injectable()
export class ConversationsService implements IConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    private userService: UsersService,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}
  async createConversation(
    user: User,
    params: CreateConversationParams,
  ): Promise<Conversation> {
    console.log(user);
    console.log('wiadomosc');
    console.log(params.message);
    console.log('nazwa uzytkownika');
    console.log(params.username);
    const recipient = await this.userService.findUser({
      username: params.username,
    });
    const newConversation = this.conversationRepository.create({
      creator: user,
      recipient,
    });

    const exists = await this.isCreated(user.id, recipient.id);
    if (exists) {
      throw new HttpException(
        'Conversation already exists',
        HttpStatus.CONFLICT,
      );
    }

    const conversation =
      await this.conversationRepository.save(newConversation);

    const newMessage = this.messageRepository.create({
      content: params.message,
      conversation,
      author: user,
    });
    await this.messageRepository.save(newMessage);
    return conversation;
  }

  getConversations(userId: number): Promise<Conversation[]> {
    return;
  }

  save(conversation: Conversation): void {
    return;
  }

  isCreated(creatorId: number, recipientId: number): Promise<Conversation> {
    return this.conversationRepository.findOne({
      where: [
        {
          creator: { id: creatorId },
          recipient: { id: recipientId },
        },
      ],
    });
  }
}
