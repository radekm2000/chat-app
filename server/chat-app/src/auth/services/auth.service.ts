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

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokensService,
    private usersService: UsersService,
    private jwtSerivce: JwtService,
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
      { username: payload.username },
      { secret: jwtConstants.secret, expiresIn: '15m' },
    );
    return accessToken;
  }

  async changePassword(dto: ChangePasswordDto) {
    const passwordTokenInDb = await this.tokenService.getTokenByHashedToken(
      dto.token,
    );
    if (!passwordTokenInDb) {
      throw new HttpException(
        'Invalid or expired password reset token',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isValid = bcrypt.compare(dto.token, passwordTokenInDb.token);
    if (!isValid) {
      throw new HttpException(
        'Invalid or expired password reset token',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.findUser({
      id: passwordTokenInDb.user.id,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.password = hashedPassword;
    await this.usersService.saveUser(user);

    return { message: 'Password changed sucesfully' };
  }
}
