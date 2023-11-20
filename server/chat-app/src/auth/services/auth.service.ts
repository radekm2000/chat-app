import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CustomRequest, LoginUserParams } from 'src/utils/types/types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import 'dotenv/config';
import { jwtConstants } from '../constants';
import { ChangePasswordDto } from 'src/utils/dtos/zodSchemas';
import { TokensService } from 'src/tokens/tokens.service';
import { ResetPasswordToken } from 'src/utils/entities/resetPasswordToken.entity';
import { VerifyUserEmailDto } from 'src/utils/dtos/VerifyUserEmailDto.dto';
import { giveUuid } from 'src/utils/uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokensService,
    private usersService: UsersService,
    private jwtSerivce: JwtService,
    @InjectRepository(ResetPasswordToken)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordToken>,
  ) {}

  async signIn(res: Response, userDetails: LoginUserParams) {
    const user = await this.usersService.findUser(userDetails);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const match = await bcrypt.compare(userDetails.password, user.password);

    if (!match) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, username: user.username };
    const accessToken = await this.jwtSerivce.signAsync(payload, {
      expiresIn: '10h',
    });
    const refreshToken = await this.jwtSerivce.signAsync(payload, {
      expiresIn: '24h',
      secret: jwtConstants.refreshSecret,
    });
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return accessToken;
  }

  async handleRefreshToken(req: CustomRequest) {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = cookies.jwt;
    console.log(refreshToken);

    const payload = await this.jwtSerivce.verifyAsync(refreshToken, {
      secret: jwtConstants.refreshSecret,
    });

    const accessToken = await this.jwtSerivce.signAsync(
      { username: payload.username, id: payload.id },
      { secret: jwtConstants.secret, expiresIn: '15m' },
    );
    return { accessToken, username: payload.username };
  }

  async changePassword(dto: ChangePasswordDto) {
    const passwordTokenInDb = await this.tokenService.getTokenByUserId(
      dto.userId,
    );
    if (!passwordTokenInDb) {
      throw new HttpException(
        'Invalid or expired reset password token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValid = bcrypt.compare(dto.token, passwordTokenInDb.token);
    if (!isValid) {
      throw new HttpException(
        'Invalid or expired reset password token',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.findUser({
      id: dto.userId,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.password = hashedPassword;
    await this.usersService.saveUser(user);
    return { message: 'Password changed successfully' };
  }

  async sendResetPasswordEmail(verifyUserEmailDto: VerifyUserEmailDto) {
    const user = await this.usersService.findUser({
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

    await this.usersService.sendEmail(user, uniqueResetToken);
    return {
      message: `If matching account was found an email was sent to ${verifyUserEmailDto.email}`,
    };
  }
}
