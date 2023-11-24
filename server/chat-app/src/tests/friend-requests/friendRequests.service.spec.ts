import { HttpException, HttpStatus } from '@nestjs/common';
import { FriendRequestsService } from 'src/friend-requests/services/friends-request.service';
import { Friend } from 'src/utils/entities/friend.entity';
import { FriendRequest } from 'src/utils/entities/friendRequest.entity';

describe('friendRequest service CreateFriendRequest method', () => {
  it('should throw an error if user is not found', async () => {
    const usersService = {
      findUser: jest.fn().mockResolvedValue(null),
    } as any;

    const friendsService = {
      isFriends: jest.fn(),
    } as any;

    const friendRequestRepository = {
      create: jest.fn(),
    } as any;
    const dtoUserMock = {
      userId: 123,
      username: 'radek',
    };
    const authUserMock = {
      id: 1,
      username: 'victor',
    } as any;
    const friendRequestsService = new FriendRequestsService(
      friendRequestRepository,
      friendsService,
      usersService,
    );

    try {
      await friendRequestsService.createFriendRequest({
        dto: dtoUserMock,
        authUser: authUserMock,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('User to add does not exist');
      expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });

  it('should throw an error if friend request is already sent and user is trying to send again', async () => {
    const dtoUserMock = {
      userId: 123,
      username: 'radek',
    };
    const authUserMock = {
      id: 1,
      username: 'victor',
    } as any;
    const usersService = {
      findUser: jest.fn().mockResolvedValue(dtoUserMock),
    } as any;

    const friendsService = {
      isFriends: jest.fn(),
    } as any;

    const friendRequestRepository = {
      create: jest.fn(),
      findOne: jest.fn().mockResolvedValue({} as FriendRequest),
    } as any;
    const friendRequestsService = new FriendRequestsService(
      friendRequestRepository,
      friendsService,
      usersService,
    );

    try {
      await friendRequestsService.createFriendRequest({
        dto: dtoUserMock,
        authUser: authUserMock,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Friend request has already been sent');
      expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });
  it('should throw an error if you are friends with somebody and try to send him a friend request', async () => {
    const dtoUserMock = {
      userId: 123,
      username: 'radek',
    };
    const authUserMock = {
      id: 1,
      username: 'victor',
    } as any;
    const usersService = {
      findUser: jest.fn().mockResolvedValue(dtoUserMock),
    } as any;

    const friendsService = {
      isFriends: jest.fn().mockResolvedValue({} as Friend),
    } as any;

    const friendRequestRepository = {
      create: jest.fn(),
      findOne: jest.fn().mockResolvedValue(null),
    } as any;
    const friendRequestsService = new FriendRequestsService(
      friendRequestRepository,
      friendsService,
      usersService,
    );

    try {
      await friendRequestsService.createFriendRequest({
        dto: dtoUserMock,
        authUser: authUserMock,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('You are friends already');
      expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });
  it('should return succesfull message that friend request has been sent', async () => {
    const dtoUserMock = {
      userId: 123,
      username: 'radek',
    };
    const authUserMock = {
      id: 1,
      username: 'victor',
    } as any;
    const usersService = {
      findUser: jest.fn().mockResolvedValue(dtoUserMock),
    } as any;

    const friendsService = {
      isFriends: jest.fn().mockResolvedValue(null),
    } as any;

    const friendRequestRepository = {
      create: jest.fn(),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
    } as any;
    const friendRequestsService = new FriendRequestsService(
      friendRequestRepository,
      friendsService,
      usersService,
    );

    const response = await friendRequestsService.createFriendRequest({
      dto: dtoUserMock,
      authUser: authUserMock,
    });

    expect(response).toHaveProperty('message');
    expect(response.message).toEqual('Friend request has been sent');
  });
});
