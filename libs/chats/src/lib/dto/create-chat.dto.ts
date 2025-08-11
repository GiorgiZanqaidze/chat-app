import { IsArray, ArrayMinSize, IsString } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  participants!: string[];
}


