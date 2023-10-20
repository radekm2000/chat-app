import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { FindUserParams } from 'src/utils/types/types';
import { Public } from 'src/auth/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
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

  @Post('findByNickname')
  async findUserByNickname(@Body() findUserParams: FindUserParams) {
    console.log(findUserParams.username);
    return await this.usersService.findUserIdByNickname(findUserParams);
  }

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const targetFolderPath = `C:\\Users\\radek\\OneDrive\\Pulpit\\chat-app\\server\\chat-app\\src\\uploads\\temp`;
    if (!fs.existsSync(targetFolderPath)) {
      fs.mkdirSync(targetFolderPath, { recursive: true });
    }

    const targetFilePath = path.join(targetFolderPath, file.originalname);

    try {
      fs.writeFile(targetFilePath, file.buffer, () => {});
      console.log('Plik został zapisany w: ', targetFilePath);
      return {
        status: 'success',
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'error',
      };
    }
  }
}
