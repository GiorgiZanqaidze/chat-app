import { Module } from '@nestjs/common';
import { AuthModule } from '@chat-app/auth';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
