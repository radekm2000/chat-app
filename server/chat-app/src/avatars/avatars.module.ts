import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/utils/entities/avatar.entity';
import { AvatarsController } from './controllers/avatars.controller';
import { AvatarsService } from './services/avatars.service';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/utils/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar, User])],
  controllers: [AvatarsController],
  providers: [AvatarsService, UsersService],
})
export class AvatarsModule {}
