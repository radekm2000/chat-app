import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsService } from 'src/friends/services/friends.services';
import { UsersService } from 'src/users/services/users.service';
import { CreateFriendRequestDto } from 'src/utils/dtos/zodSchemas';
import { Friend } from 'src/utils/entities/friend.entity';
import { FriendRequest } from 'src/utils/entities/friendRequest.entity';
import { User } from 'src/utils/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService,
  ) {}
  async createFriendRequest({
    dto,
    authUser,
  }: {
    dto: CreateFriendRequestDto;
    authUser: User;
  }) {
    const user = await this.usersService.findUser({ id: dto.userId });
    if (!user) {
      throw new HttpException(
        'User to add does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const friendRequestExists = await this.friendRequestExists(
      authUser.id,
      dto.userId,
    );
    if (friendRequestExists) {
      throw new HttpException(
        'Friend request has already been sent',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const friendRequest = this.friendRequestRepository.create({
      sender: authUser,
      receiver: user,
      status: 'pending',
    });

    const isFriends = await this.friendsService.isFriends(
      authUser.id,
      dto.userId,
    );
    if (isFriends) {
      throw new HttpException(
        'You are friends already',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.friendRequestRepository.save(friendRequest);

    return { message: 'Friend request has been sent' };
  }

  async friendRequestExists(authUserId: number, userId: number) {
    return await this.friendRequestRepository.findOne({
      where: [
        {
          sender: { id: authUserId },
          receiver: { id: userId },
        },
        {
          sender: { id: userId },
          receiver: { id: authUserId },
        },
      ],
    });
  }

  async acceptFriendRequest(friendRequestId: number, authUser: User) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: friendRequestId },
      relations: ['receiver', 'sender'],
    });

    if (!friendRequest) {
      throw new HttpException(
        'Friend request does no longer exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPending = this.isPending(friendRequest);
    if (!isPending) {
      throw new HttpException(
        'Friend request has already been rejected or accepted',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (friendRequest.receiver?.id !== authUser?.id) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    friendRequest.status = 'accepted';
    this.friendRequestRepository.save(friendRequest);

    const newFriend = this.friendRepository.create({
      sender: friendRequest.sender,
      receiver: friendRequest.receiver,
    });

    this.friendRepository.save(newFriend);
    return { friend: newFriend };
  }

  async rejectFriendRequest() {
    return;
  }

  async findById(id: number): Promise<FriendRequest> {
    return this.friendRequestRepository.findOne({
      where: {
        id: id,
      },
      relations: ['receiver', 'sender'],
    });
  }

  async isPending(friendRequest: FriendRequest) {
    return friendRequest.status === 'pending';
  }

  async getFriendRequests(authUser: User) {
    return await this.friendRequestRepository.find({
      where: [{ receiver: { id: authUser.id }, status: 'pending' }],
      relations: ['receiver', 'sender'],
    });
  }
}
