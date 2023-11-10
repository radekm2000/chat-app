import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyUserEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
