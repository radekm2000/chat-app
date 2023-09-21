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

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private userService: UsersService,
  ) {}

  async createMessage(
    params: CreateMessageParams,
  ): Promise<CreateMessageResponse> {
    const { content, author } = params;
    const message = this.messageRepository.create({
      content,
      author: author,
    });
    console.log(message);
    const savedMessage = await this.messageRepository.save(message);

    return { message: savedMessage };
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
