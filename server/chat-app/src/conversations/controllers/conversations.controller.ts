import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/utils/entities/user.entity';
import { ConversationsService } from '../services/conversations.service';
import { CreateConversationDto } from 'src/utils/dtos/CreateConversationDto.dto';
import { ParseIntPipe } from 'src/utils/pipes/parseIntPipe';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async getUserConversation(@AuthUser() user: User) {
    return await this.conversationsService.getConversations(user.id);
  }

  @Get(':id')
  async getConversation(
    @Param('id', ParseIntPipe) recipientId: number, 
    @AuthUser() user: User,
  ) {
    return this.conversationsService.getConversation(user.id, recipientId);
  }

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    return this.conversationsService.createConversation(
      user,
      createConversationPayload,
    );
  }
}
