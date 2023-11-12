import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'ormconfig';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AvatarsModule } from './avatars/avatars.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    GatewayModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(config),
    MessagesModule,
    ConversationsModule,
    AvatarsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
