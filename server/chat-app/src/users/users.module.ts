import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/entities/user.entity';
import { Avatar } from 'src/utils/entities/avatar.entity';
import { ResetPasswordToken } from 'src/utils/entities/resetPasswordToken.entity';
import { TokensService } from 'src/tokens/tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Avatar, ResetPasswordToken])],
  providers: [UsersService, TokensService],
  controllers: [UsersController],
})
export class UsersModule {}
