import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { FindUserParams } from 'src/utils/types/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('search')
  async searchUser(@Query('query') query: string) {
    console.log(query);
    return await this.usersService.searchUserByName(query);
  }

  @Post('find')
  async findUser(@Body() findUserParams: FindUserParams) {
    return this.usersService.findUser(findUserParams);
  }
}
