import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/utils/dtos/CreateUserDto.dto';
import { CustomRequest, LoginUserParams } from 'src/utils/types/types';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { Public } from '../constants';
import { VerifyUserEmailDto } from 'src/utils/dtos/VerifyUserEmailDto.dto';
import { ZodValidationPipe } from 'src/tests/pipes/ZodValidationPipe';
import {
  ChangePasswordDto,
  ChangePasswordDtoSchema,
} from 'src/utils/dtos/zodSchemas';
import { ZodExceptionFilter } from 'src/utils/ZodExceptionFilter';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Public()
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

  @Public()
  @Get('refresh')
  async handleRefreshToken(@Req() req: CustomRequest) {
    return this.authService.handleRefreshToken(req);
  }

  @Public()
  @Post('/verifyEmail')
  @UsePipes(new ValidationPipe())
  async sendResetPasswordEmail(@Body() verifyUserEmailDto: VerifyUserEmailDto) {
    return await this.authService.sendResetPasswordEmail(verifyUserEmailDto);
  }

  @Public()
  @UseFilters(new ZodExceptionFilter())
  @UsePipes(new ZodValidationPipe(ChangePasswordDtoSchema))
  @Post('/changePassword')
  async changePasssword(@Body() dto: ChangePasswordDto) {
    return await this.authService.changePassword(dto);
  }
}
