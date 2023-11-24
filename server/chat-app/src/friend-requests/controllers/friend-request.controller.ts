import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
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
  @Get()
  async getFriendRequests(@AuthUser() authUser: User) {
    return await this.friendRequestsService.getFriendRequests(authUser);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateFriendRequestSchema))
  async createFriendRequest(
    @AuthUser() authUser: User,
    @Body() dto: CreateFriendRequestDto,
  ) {
    return await this.friendRequestsService.createFriendRequest({
      dto,
      authUser,
    });
  }
  @Patch(':id/reject')
  async rejectFriendRequest() {
    return await this.friendRequestsService.rejectFriendRequest();
  }

  @Patch(':id/accept')
  async acceptFriendRequest(
    @AuthUser() authUser: User,
    @Param('id', ParseIntPipe) friendRequestId: number,
  ) {
    console.log(friendRequestId);
    return await this.friendRequestsService.acceptFriendRequest(
      friendRequestId,
      authUser,
    );
  }
}
