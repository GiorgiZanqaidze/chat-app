import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageResponseDto {
  @ApiProperty({ description: 'Sender user ID', example: 'user-1' })
  senderId!: string;

  @ApiProperty({ description: 'Message text', example: 'Hello there!' })
  content!: string;

  @ApiProperty({ description: 'When the message was sent', example: '2024-01-01T12:00:00.000Z' })
  sentAt!: string;
}

export class ChatResponseDto {
  @ApiProperty({ description: 'Chat ID', example: '66b7a5b4f7dbf9f4c8d2d0a1' })
  id!: string;

  @ApiProperty({ type: [String], description: 'Participants user IDs' })
  participants!: string[];

  @ApiProperty({ type: [ChatMessageResponseDto], description: 'Ordered messages' })
  messages!: ChatMessageResponseDto[];

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ description: 'Update timestamp', example: '2024-01-01T12:05:00.000Z' })
  updatedAt!: string;
}


