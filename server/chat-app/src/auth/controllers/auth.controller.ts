import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/utils/dtos/CreateUserDto.dto';
import { CustomRequest, LoginUserParams } from 'src/utils/types/types';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { Public } from '../constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Public()
  @Post('login')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() userDetails: LoginUserParams,
  ) {
    return this.authService.signIn(res, userDetails);
  }

  @Get('refresh')
  async handleRefreshToken(@Req() req: CustomRequest) {
    return this.authService.handleRefreshToken(req);
  }
}
