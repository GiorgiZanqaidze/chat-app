import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class ChatMessage {
  @Prop({ required: true })
  senderId!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: Date, default: Date.now })
  sentAt!: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  _id!: Types.ObjectId;

  @Prop({ type: [String], required: true, index: true })
  participants!: string[];

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages!: ChatMessage[];

  @Prop({ type: Date })
  createdAt!: Date;

  @Prop({ type: Date })
  updatedAt!: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);


