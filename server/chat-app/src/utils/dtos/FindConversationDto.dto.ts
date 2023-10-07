import { IsNotEmpty } from 'class-validator';

export class FindConversationDto {
  @IsNotEmpty()
  recipientId: number;
}
