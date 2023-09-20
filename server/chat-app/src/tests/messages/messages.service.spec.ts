import { HttpException, HttpStatus } from '@nestjs/common';
import { MessagesService } from 'src/messages/services/messages.service';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/utils/entities/user.entity';
import {
  CreateMessageParams,
  CreateMessageResponse,
} from 'src/utils/types/types';

describe('Message Service CreateMessage method', () => {
  let usersService: UsersService;
  let messageService: MessagesService;
  let messageRepositoryMock: Record<string, jest.Mock>;
  it('should throw an invalid user if verified user doesnt match with user in db', async () => {
    usersService = {
      findUser: jest.fn().mockResolvedValue(null),
    } as unknown as UsersService;

    messageRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    const params: CreateMessageParams = {
      content: 'hello world',
      author: { id: 1, username: 'testuser' } as User,
    };

    messageService = new MessagesService(
      messageRepositoryMock as any,
      usersService,
    );

    await expect(messageService.createMessage(params)).rejects.toThrowError(
      new HttpException('Invalid user', HttpStatus.UNAUTHORIZED),
    );
    expect(usersService.findUser).toHaveBeenCalledWith({
      id: params.author.id,
      username: params.author.username,
    });

    expect(messageRepositoryMock.create).not.toHaveBeenCalled();
    expect(messageRepositoryMock.save).not.toHaveBeenCalled();
  });
  it('should create a message', async () => {
    const authorMock = {
      id: 1,
      username: 'testuser',
    } as User;
    usersService = {
      findUser: jest.fn().mockResolvedValue(authorMock),
    } as unknown as UsersService;

    const params: CreateMessageParams = {
      content: 'hello world',
      author: authorMock,
    };

    const createdMessage = {
      content: 'hello world',
      author: authorMock,
    };
    messageRepositoryMock = {
      create: jest.fn().mockResolvedValue(createdMessage),
      save: jest.fn().mockResolvedValue(createdMessage),
    } as any;

    messageService = new MessagesService(
      messageRepositoryMock as any,
      usersService,
    );

    const response: CreateMessageResponse =
      await messageService.createMessage(params);

    expect(response).toBeDefined();
    expect(response).toHaveProperty('message');
    expect(response.message.content).toBe('hello world');
    expect(response.message.author).toBe(authorMock);

    expect(usersService.findUser).toHaveBeenCalledWith({
      id: params.author.id,
      username: params.author.username,
    });

    expect(messageRepositoryMock.create).toHaveBeenCalled();
    expect(messageRepositoryMock.save).toHaveBeenCalled();
  });
});
