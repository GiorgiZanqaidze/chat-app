import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChatResponseDto, ChatMessageResponseDto } from './dto/chat-response.dto';
import { AuthenticatedRequest } from './interfaces/chat.interfaces';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @ApiOperation({ summary: 'List chats for current user' })
  @ApiOkResponse({ type: [ChatResponseDto] })
  async list(@Req() req: AuthenticatedRequest) {
    return this.chatsService.listChats(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a chat with given participants' })
  @ApiCreatedResponse({ type: ChatResponseDto })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateChatDto,
  ) {
    return this.chatsService.createChat(req.user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID for current user' })
  @ApiParam({ name: 'id', description: 'Chat ID' })
  @ApiOkResponse({ type: ChatResponseDto })
  async getById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.chatsService.getChatById(req.user.userId, id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'List messages for a chat' })
  @ApiParam({ name: 'id', description: 'Chat ID' })
  @ApiOkResponse({ type: [ChatMessageResponseDto] })
  async listMessages(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.chatsService.listMessages(req.user.userId, id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send message to a chat' })
  @ApiParam({ name: 'id', description: 'Chat ID' })
  @ApiCreatedResponse({ type: ChatResponseDto })
  async sendMessage(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatsService.sendMessage(req.user.userId, id, dto);
  }
}


