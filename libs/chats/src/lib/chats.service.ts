import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  async createChat(userId: string, dto: CreateChatDto): Promise<Chat> {
    const uniqueParticipants = Array.from(new Set([userId, ...dto.participants]));
    const chat = await this.chatModel.create({ participants: uniqueParticipants });
    return chat.toObject();
  }

  async listChats(userId: string): Promise<Chat[]> {
    return this.chatModel.find({ participants: userId }).sort({ updatedAt: -1 }).lean();
  }

  async getChatById(userId: string, chatId: string): Promise<Chat> {
    const chat = await this.chatModel.findOne({ _id: new Types.ObjectId(chatId), participants: userId }).lean();
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }

  async listMessages(userId: string, chatId: string): Promise<Chat['messages']> {
    const chat = await this.getChatById(userId, chatId);
    return chat.messages || [];
  }

  async sendMessage(userId: string, chatId: string, dto: SendMessageDto): Promise<Chat> {
    const result = await this.chatModel.findOneAndUpdate(
      { _id: new Types.ObjectId(chatId), participants: userId },
      { $push: { messages: { senderId: userId, content: dto.content, sentAt: new Date() } } },
      { new: true },
    ).lean();
    if (!result) throw new NotFoundException('Chat not found');
    return result;
  }
}


