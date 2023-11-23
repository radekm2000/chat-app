import { IsNotEmpty } from 'class-validator';

export class FindConversationDto {
  @IsNotEmpty()
  userId: number;
}
