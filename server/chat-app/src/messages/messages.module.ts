import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/utils/entities/message.entity';
import { User } from 'src/utils/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [MessagesService, UsersService],
  controllers: [MessagesController],
})
export class MessagesModule {}
