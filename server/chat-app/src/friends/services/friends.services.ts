import { Injectable } from '@nestjs/common';
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
