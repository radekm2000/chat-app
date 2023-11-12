import { Controller, Get, Param } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokenService: TokensService) {}

  @Get()
  async getTokens() {
    return await this.tokenService.getTokens();
  }

  @Get('/user')
  async getTokenByUserId(token: string) {
    return await this.tokenService.getTokenByHashedToken(token);
  }
}
