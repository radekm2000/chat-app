import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CustomRequest, LoginUserParams } from 'src/utils/types/types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import 'dotenv/config';
import { jwtConstants } from '../constants';

@Injectable()
export class AuthService {
  constructor(
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
      expiresIn: '10s',
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
    console.log(req.user);
    console.log(req);
    const cookies = req.cookies;
    console.log(`ciasteczko jwt`, cookies.jwt);
    if (!cookies.jwt) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = cookies.jwt;

    const payload = await this.jwtSerivce.verifyAsync(refreshToken, {
      secret: jwtConstants.refreshSecret,
    });

    const accessToken = await this.jwtSerivce.signAsync(
      { username: payload.username },
      { secret: jwtConstants.secret, expiresIn: '15m' },
    );
    console.log('nowo wydany acces  token : ', accessToken);
    return accessToken;
  }
}
