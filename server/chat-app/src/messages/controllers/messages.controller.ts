import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from 'src/utils/dtos/CreateMessageDto.dto';
import { CustomRequest } from 'src/utils/types/types';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Post()
  async createMessage(
    @Req() req: CustomRequest,
    @Body() { content }: CreateMessageDto,
  ) {
    const author = req.user;
    const params = { author, content };
    return await this.messageService.createMessage(params);
  }

  @Get(':id')
  async getMessages(@Param('id', ParseIntPipe) userId: number) {
    return await this.messageService.getMessages(userId);
  }
}
