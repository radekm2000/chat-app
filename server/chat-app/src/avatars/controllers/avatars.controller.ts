import { Controller, Get, Param } from '@nestjs/common';
import { AvatarsService } from '../services/avatars.service';
import { User } from 'src/utils/entities/user.entity';
import { AuthUser } from 'src/decorators/user.decorator';
import { UsersService } from 'src/users/services/users.service';

@Controller('avatars')
export class AvatarsController {
  constructor(
    private readonly avatarsService: AvatarsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getAvatars() {
    return await this.avatarsService.getAvatars();
  }

  @Get('/avatar')
  async getAvatar(@AuthUser() user: User) {
    const existingUser = await this.usersService.findUser({ id: user.id });

    const avatarId = existingUser.avatar.id;

    if (!avatarId) {
      return { message: "This user doesn't have an avatar" };
    }

    return await this.avatarsService.getAvatar(avatarId);
  }

  @Get(':id')
  async getAvatarByUserId(@Param() params: any) {
    const existingUser = await this.usersService.findUser({
      id: params?.id,
    });

    const avatarId = existingUser?.avatar?.id;
    console.log(avatarId);
    if (!avatarId) {
      return null;
    }

    return this.avatarsService.getAvatar(avatarId);
  }
}
