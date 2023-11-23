import { Module } from '@nestjs/common';
import { FriendRequestsController } from './controllers/friend-request.controller';
import { FriendRequestsService } from './services/friends-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from 'src/utils/entities/friendRequest.entity';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/utils/entities/user.entity';
import { FriendsService } from 'src/friends/services/friends.services';
import { Friend } from 'src/utils/entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, User, Friend])],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService, UsersService, FriendsService],
})
export class FriendsRequestModule {}
