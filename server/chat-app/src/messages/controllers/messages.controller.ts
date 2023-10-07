import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from 'src/utils/dtos/CreateMessageDto.dto';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/utils/entities/user.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Body() { content, conversationId }: CreateMessageDto,
  ) {
    return await this.messageService.createMessage({
      author: user,
      content,
      conversationId,
    });
  }

  @Get(':id')
  async getMessages(@Param('id', ParseIntPipe) userId: number) {
    return await this.messageService.getMessages(userId);
  }
}
