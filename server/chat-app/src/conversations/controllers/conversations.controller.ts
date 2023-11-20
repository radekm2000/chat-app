import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/utils/entities/user.entity';
import { ConversationsService } from '../services/conversations.service';
import { CreateConversationDto } from 'src/utils/dtos/CreateConversationDto.dto';
import { FindConversationDto } from 'src/utils/dtos/FindConversationDto.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async getUserConversation(@AuthUser() user: User) {
    const conversations = await this.conversationsService.getConversations(
      user.id,
    );
    console.log(conversations);
    return conversations;
  }

  @Post('/conversation')
  async getConversation(
    @AuthUser() user: User,
    @Body() findConversationDto: FindConversationDto,
  ) {
    return this.conversationsService.getConversation(
      user.id,
      findConversationDto.recipientId,
    );
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
