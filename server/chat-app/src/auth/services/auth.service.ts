import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { LoginUserParams } from 'src/utils/types/types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtSerivce: JwtService,
  ) {}

  async signIn(res: Response, userDetails: LoginUserParams) {
    console.log(userDetails);
    const user = await this.usersService.findUser(userDetails);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const match = await bcrypt.compare(userDetails.password, user.password);

    if (!match) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const payload = { sub: user.id, username: user.username };

    res.cookie('jwt', await this.jwtSerivce.signAsync(payload), {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return;
  }
}
