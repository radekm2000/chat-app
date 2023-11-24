import { Body, Controller, Post, UseFilters, UsePipes } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { ZodValidationPipe } from 'src/tests/pipes/ZodValidationPipe';
import { ZodExceptionFilter } from 'src/utils/ZodExceptionFilter';
import {
  CreateFriendRequestDto,
  CreateFriendRequestSchema,
} from 'src/utils/dtos/zodSchemas';
import { FriendRequestsService } from '../services/friends-request.service';
import { User } from 'src/utils/entities/user.entity';

@Controller('friend-requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}
  @UsePipes(new ZodValidationPipe(CreateFriendRequestSchema))
  @Post()
  async createFriendRequest(
    @AuthUser() authUser: User,
    @Body() dto: CreateFriendRequestDto,
  ) {
    console.log(dto);
    return await this.friendRequestsService.createFriendRequest({
      dto,
      authUser,
    });
  }
}
