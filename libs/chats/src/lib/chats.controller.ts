import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async list(@Req() req: { user: { userId: string; username: string } }) {
    return this.chatsService.listChats(req.user.userId);
  }

  @Post()
  async create(
    @Req() req: { user: { userId: string; username: string } },
    @Body() dto: CreateChatDto,
  ) {
    return this.chatsService.createChat(req.user.userId, dto);
  }

  @Get(':id')
  async getById(
    @Req() req: { user: { userId: string; username: string } },
    @Param('id') id: string,
  ) {
    return this.chatsService.getChatById(req.user.userId, id);
  }

  @Get(':id/messages')
  async listMessages(
    @Req() req: { user: { userId: string; username: string } },
    @Param('id') id: string,
  ) {
    return this.chatsService.listMessages(req.user.userId, id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Req() req: { user: { userId: string; username: string } },
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatsService.sendMessage(req.user.userId, id, dto);
  }
}


