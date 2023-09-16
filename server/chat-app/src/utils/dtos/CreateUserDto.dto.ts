import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Username must contain at least 5 chars.' })
  username: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must contain at least 8 chars.  ' })
  password: string;
}
