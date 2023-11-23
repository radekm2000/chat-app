import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/utils/entities/friend.entity';
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
}
