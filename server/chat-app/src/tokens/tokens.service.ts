import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordToken } from 'src/utils/entities/resetPasswordToken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(ResetPasswordToken)
    private readonly tokenRepository: Repository<ResetPasswordToken>,
  ) {}

  async getTokens() {
    return await this.tokenRepository.find({});
  }

  async getTokenByUserId(userId: number) {
    const resetPasswordToken = await this.tokenRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!resetPasswordToken) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    return resetPasswordToken;
  }
}
