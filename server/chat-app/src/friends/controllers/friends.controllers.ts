import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/utils/entities/user.entity';
import { FriendsService } from '../services/friends.services';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @Get()
  async getAllFriends(@AuthUser() authUser: User) {
    return await this.friendsService.getAllFriends(authUser);
  }

  @Delete(':id')
  async deleteFriend(
    @AuthUser() authUser: User,
    @Param('id', ParseIntPipe) friendRecordId: number,
  ) {
    return await this.friendsService.deleteFriend(authUser, friendRecordId);
  }
}
