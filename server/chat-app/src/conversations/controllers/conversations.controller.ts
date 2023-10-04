import { Body, Controller, Post } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/utils/entities/user.entity';
import { ConversationsService } from '../services/conversations.service';
import { CreateConversationDto } from 'src/utils/dtos/CreateConversationDto.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}
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
