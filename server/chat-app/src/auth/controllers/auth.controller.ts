import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/utils/dtos/CreateUserDto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
