import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: 'Message text content', example: 'Hello there!' })
  @IsString()
  content!: string;
}


