import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'ormconfig';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AvatarsModule } from './avatars/avatars.module';
import { FriendsModule } from './friends/friends.module';
import { FriendsRequestModule } from './friend-requests/friends-request.module';

@Module({
  imports: [
    GatewayModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(config),
    MessagesModule,
    ConversationsModule,
    AvatarsModule,
    FriendsModule,
    FriendsRequestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
