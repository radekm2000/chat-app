import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsService } from 'src/friends/services/friends.services';
import { UsersService } from 'src/users/services/users.service';
import { CreateFriendRequestDto } from 'src/utils/dtos/zodSchemas';
import { FriendRequest } from 'src/utils/entities/friendRequest.entity';
import { User } from 'src/utils/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
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
}
