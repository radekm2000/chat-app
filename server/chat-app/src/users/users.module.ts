import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/entities/user.entity';
import { Avatar } from 'src/utils/entities/avatar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Avatar])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
