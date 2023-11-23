import { Module } from '@nestjs/common';
import { FriendsService } from './services/friends.services';
import { FriendsController } from './controllers/friends.controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/utils/entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
