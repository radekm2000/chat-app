import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindUserAvatarDto {
  @IsNumber()
  userId: number;
}
