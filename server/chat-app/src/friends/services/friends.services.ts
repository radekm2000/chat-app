import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/utils/entities/friend.entity';
import { User } from 'src/utils/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}

  async isFriends(authUserId: number, userId: number) {
    return await this.friendRepository.findOne({
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

  async deleteFriend(authUser: User, friendRecordId: number) {
    const friendRecord = await this.friendRepository.findOne({
      where: [
        { sender: { id: authUser.id } },
        { receiver: { id: authUser.id } },
      ],
      relations: ['receiver', 'sender'],
      select: {
        receiver: {
          username: true,
          id: true,
        },
        sender: {
          username: true,
          id: true,
        },
        id: true,
      },
    });

    if (!friendRecord) {
      throw new HttpException(
        'Cannot delete friend record that doesnt exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.friendRepository.delete(friendRecordId);

    return { friendRecord };
  }

  async getAllFriends(authUser: User) {
    return await this.friendRepository.find({
      where: [
        {
          sender: { id: authUser.id },
        },
        {
          receiver: { id: authUser.id },
        },
      ],
      relations: ['receiver', 'sender'],
      select: {
        receiver: {
          username: true,
          id: true,
        },
        sender: {
          username: true,
          id: true,
        },
        id: true,
      },
    });
  }
}
