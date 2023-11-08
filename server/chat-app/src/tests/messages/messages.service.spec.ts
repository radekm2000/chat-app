import { ConversationsService } from 'src/conversations/services/conversations.service';
import { MessagesService } from 'src/messages/services/messages.service';
import { UsersService } from 'src/users/services/users.service';
import { Conversation } from 'src/utils/entities/conversation.entity';
import { Message } from 'src/utils/entities/message.entity';
import { User } from 'src/utils/entities/user.entity';
import {
  CreateMessageParams,
  CreateMessageResponse,
} from 'src/utils/types/types';

describe('Message Service CreateMessage method', () => {
  let usersService: UsersService;
  let messageService: MessagesService;
  let messageRepositoryMock: Record<string, jest.Mock>;
  let conversationService: ConversationsService;
  let conversationRepositoryMock: Record<string, jest.Mock>;
  beforeEach(() => {
    // conversationService = {
    //   findById: jest.fn().mockResolvedValue(Conversation),
    // } as any;
    // conversationRepositoryMock = {
    //   findOne: jest.fn().mockResolvedValue(Conversation),
    // };
  });
  it('should create a message', async () => {
    const authorMock = {
      id: 1,
      username: 'testuser',
    } as User;

    const params: CreateMessageParams = {
      content: 'hello world',
      author: authorMock,
      conversationId: 2,
    };

    const conversationMock = { id: 2 } as Conversation;
    const createdMessage = {
      content: 'hello world',
      author: authorMock,
      conversation: conversationMock,
      createdAt: new Date('2023-01-01'),
    };

    messageRepositoryMock = {
      create: jest.fn().mockResolvedValue(createdMessage),
      save: jest.fn().mockResolvedValue(createdMessage),
    } as any;

    conversationRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(conversationMock),
      save: jest.fn().mockResolvedValue(conversationMock),
    };
    conversationService = {
      findById: jest.fn().mockResolvedValue(conversationMock),
    } as unknown as ConversationsService;

    messageService = new MessagesService(
      messageRepositoryMock as any,
      usersService,
      conversationService,
      conversationRepositoryMock as any,
    );

    const response: CreateMessageResponse =
      await messageService.createMessage(params);

    await expect(response.message).resolves.toEqual({
      content: 'hello world',
      author: authorMock,
      conversation: conversationMock,
      createdAt: expect.any(Date),
    });
    expect(conversationService.findById).toBeDefined();
    expect(response).toBeDefined();
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('updatedConversation');
    // expect(response.message.content).toBe('hello world');
    // expect(response.message.author).toBe(authorMock);

    expect(messageRepositoryMock.create).toHaveBeenCalled();
    expect(messageRepositoryMock.save).toHaveBeenCalled();
    expect(conversationService.findById).toHaveBeenCalled();
  });

  it('should throw an error if the conversation is not found', async () => {
    const authorMock = {
      id: 1,
      username: 'testuser',
    } as User;

    const params: CreateMessageParams = {
      content: 'hello world',
      author: authorMock,
      conversationId: 2,
    };

    const conversationMock = { id: 2 } as Conversation;
    const createdMessage = {
      content: 'hello world',
      author: authorMock,
      conversation: null,
      createdAt: new Date('2023-01-01'),
    };

    messageRepositoryMock = {
      create: jest.fn().mockResolvedValue(createdMessage),
      save: jest.fn().mockResolvedValue(createdMessage),
    } as any;

    conversationRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
    };
    conversationService = {
      findById: jest.fn().mockResolvedValue(null),
    } as unknown as ConversationsService;

    messageService = new MessagesService(
      messageRepositoryMock as any,
      usersService,
      conversationService,
      conversationRepositoryMock as any,
    );

    await expect(async () => {
      await messageService.createMessage(params);
    }).rejects.toThrow('Conversation not found');
  });
});
