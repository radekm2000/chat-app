/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IConversationService } from '../interfaces/conversations.interface';
import { Conversation } from 'src/utils/entities/conversation.entity';
import { User } from 'src/utils/entities/user.entity';
import { AccessParams, CreateConversationParams } from 'src/utils/types/types';
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
    const recipient = await this.userService.findUser({
      username: params.username,
    });

    if (user.id === recipient.id) {
      throw new HttpException(
        'Cannot create conversation with  yourself',
        HttpStatus.CONFLICT,
      );
    }
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
    const savedMessage = await this.messageRepository.save(newMessage);
    conversation.lastMessageSent = savedMessage;
    return conversation;
  }

  async getConversations(userId: number): Promise<Conversation[]> {
    const conversations = await this.conversationRepository.find({
      where: [
        {
          creator: { id: userId },
        },
        {
          recipient: { id: userId },
        },
      ],
      relations: ['creator', 'recipient', 'messages', 'lastMessageSent'],
    });
    return conversations;
  }

  async getConversation(
    creatorId: number,
    recipientId: number,
  ): Promise<Conversation> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .where(
        '(creator.id = :creatorId AND recipient.id = :recipientId) OR (creator.id = :recipientId AND recipient.id = :creatorId)',
        { creatorId, recipientId },
      )
      .getOne();
    const conversation = await this.conversationRepository.findOne({
      where: [
        {
          creator: { id: creatorId },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
        },
      ],
      relations: ['creator', 'recipient', 'messages', 'lastMessageSent'],
    });
    if (!conversation)
      throw new HttpException(
        'Conversation doesnt exist',
        HttpStatus.BAD_REQUEST,
      );
    return conversation;
  }

  save(conversation: Conversation): Promise<Conversation> {
    return this.conversationRepository.save(conversation);
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

  async hasAccess({ id, userId }: AccessParams) {
    const conversation = await this.findById(id);
    if (!conversation)
      throw new HttpException(
        `You dont have access to that conversation`,
        HttpStatus.FORBIDDEN,
      );

    return (
      conversation.creator.id === userId || conversation.recipient.id === userId
    );
  }

  async findById(id: number) {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'recipient', 'lastMessageSent'],
    });
    console.log('konwersacja bez wiadomosci');
    console.log(conversation);
    return conversation;
  }

  update({ conversationId, lastMessageSent }) {
    return this.conversationRepository.update(conversationId, {
      lastMessageSent,
    });
  }
}
