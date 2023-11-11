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
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/utils/dtos/CreateUserDto.dto';
import { CustomRequest, LoginUserParams } from 'src/utils/types/types';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { Public } from '../constants';
import { VerifyUserEmailDto } from 'src/utils/dtos/VerifyUserEmailDto.dto';
import { ResetPasswordToken } from 'src/utils/entities/resetPasswordToken.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { giveUuid } from 'src/utils/uuid';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    @InjectRepository(ResetPasswordToken)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordToken>,
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
    console.log(verifyUserEmailDto.email);
    const user = await this.userService.findUser({
      email: verifyUserEmailDto.email,
    });

    if (!user) {
      return {
        message: `If matching account was found an email was sent to ${verifyUserEmailDto.email}`,
      };
    }
    const uniqueResetToken = giveUuid();
    const hash = await bcrypt.hash(uniqueResetToken, 10);

    const newResetPasswordToken = new ResetPasswordToken();

    newResetPasswordToken.token = hash;
    newResetPasswordToken.user = user;
    this.resetPasswordTokenRepository.save(newResetPasswordToken);

    const mailMessage = await this.userService.sendEmail(
      user,
      uniqueResetToken,
    );
    return {
      message: `If matching account was found an email was sent to ${verifyUserEmailDto.email}`,
    };
  }
}
