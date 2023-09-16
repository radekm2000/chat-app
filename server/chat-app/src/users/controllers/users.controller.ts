import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { FindUserParams } from 'src/utils/types/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('find')
  async findUser(@Body() findUserParams: FindUserParams) {
    return this.usersService.findUser(findUserParams);
  }
}
