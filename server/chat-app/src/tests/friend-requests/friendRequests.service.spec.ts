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

    const friendRepository = {} as any;
    const friendRequestsService = new FriendRequestsService(
      friendRequestRepository,
      friendRepository,
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
    const friendRepository = {} as any;

    const friendRequestRepository = {
      create: jest.fn(),
      findOne: jest.fn().mockResolvedValue({} as FriendRequest),
    } as any;
    const friendRequestsService = new FriendRequestsService(
      friendRequestRepository,
      friendRepository,
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
    const friendRepository = {} as any;

    const friendRequestsService = new FriendRequestsService(
      friendRequestRepository,
      friendRepository,
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
    const friendRepository = {} as any;

    const friendRequestsService = new FriendRequestsService(
      friendRequestRepository,
      friendRepository,
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

describe('friendRequest service AcceptFriendRequest method', () => {
  it('should throw an error if friend request is not found', async () => {
    const friendRequestRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    } as any;

    const friendRequestId = 3;
    const friendRepository = {} as any;

    const friendsService = {} as any;
    const usersService = {} as any;

    const friendRequestService = new FriendRequestsService(
      friendRequestRepository,
      friendRepository,
      friendsService,
      usersService,
    );

    try {
      await friendRequestService.acceptFriendRequest(
        friendRequestId,
        {} as any,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Friend request does no longer exist.');
    }
  });

  it('should throw Friend request has already been rejected or accepted', async () => {
    const friendRequest = {
      status: 'accepted',
      id: 3,
    } as FriendRequest;
    const friendRequestRepository = {
      save: jest.fn(),
      findOne: jest.fn().mockResolvedValue(friendRequest),
    } as any;

    const friendRequestId = 3;
    const friendRepository = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    const friendsService = {} as any;
    const usersService = {} as any;

    const friendRequestService = new FriendRequestsService(
      friendRequestRepository,
      friendRepository,
      friendsService,
      usersService,
    );
    jest
      .spyOn(friendRequestService, 'isPending')
      .mockImplementation(async () => false);
    try {
      const response = await friendRequestService.acceptFriendRequest(
        friendRequest.id,
        {} as any,
      );
    } catch (error) {
      expect(error.message).toEqual(
        'Friend request has already been rejected or accepted',
      );
    }
  });

  it('should throw an error if friendRequest receiver id doesnt equal to us as user', async () => {
    const friendRequest = {
      id: 123,
      receiver: {
        id: 1,
      },
    } as FriendRequest;
    const authUserMock = {
      id: 2,
    } as any;
    const friendRequestRepository = {
      save: jest.fn(),
      findOne: jest.fn().mockResolvedValue(friendRequest),
    } as any;

    const friendRepository = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    const friendsService = {} as any;
    const usersService = {} as any;

    const friendRequestService = new FriendRequestsService(
      friendRequestRepository,
      friendRepository,
      friendsService,
      usersService,
    );
    jest
      .spyOn(friendRequestService, 'isPending')
      .mockImplementation(async () => true);

    try {
      await friendRequestService.acceptFriendRequest(
        friendRequest.id,
        authUserMock,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Something went wrong');
    }
  });
  it('should return new friendship as friend property ', async () => {
    const friendRequest = {
      id: 123,
      receiver: {
        id: 1,
      },
    } as FriendRequest;
    const authUserMock = {
      id: 1,
    } as any;
    const friendRequestRepository = {
      save: jest.fn(),
      findOne: jest.fn().mockResolvedValue(friendRequest),
    } as any;

    const newFriend = {
      sender: {},
      receiver: {},
    } as any;
    const friendRepository = {
      create: jest.fn().mockResolvedValue(newFriend),
      save: jest.fn(),
    } as any;

    const friendsService = {} as any;
    const usersService = {} as any;

    const friendRequestService = new FriendRequestsService(
      friendRequestRepository,
      friendRepository,
      friendsService,
      usersService,
    );
    jest
      .spyOn(friendRequestService, 'isPending')
      .mockImplementation(async () => true);
    const response = await friendRequestService.acceptFriendRequest(
      friendRequest.id,
      authUserMock,
    );
    expect(response).toHaveProperty('friend');
    await expect(response.friend).resolves.toEqual(newFriend);
    //acceptFriendrequest is promise <{friend}>
    // so we have to use await
    // and expect to have it resolved as newFriendMock
  });
});
