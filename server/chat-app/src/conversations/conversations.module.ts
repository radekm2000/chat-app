import { Module } from '@nestjs/common';
import { ConversationsController } from './controllers/conversations.controller';
import { ConversationsService } from './services/conversations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/utils/entities/conversation.entity';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/utils/entities/user.entity';
import { Message } from 'src/utils/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User, Message])],
  controllers: [ConversationsController],
  providers: [ConversationsService, UsersService],
})
export class ConversationsModule {}
