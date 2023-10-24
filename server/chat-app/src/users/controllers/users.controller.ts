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
import { multerOptions } from 'src/upload/single-upload-disk';
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
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    // const dirName = __dirname;
    // const modifiedPath = dirName.replace(/\\dist\\/, '\\');
    // console.log('modified path');
    // console.log(modifiedPath);
    // const modifiedPathToSaveAvatarTo = path.join(
    //   modifiedPath,
    //   '../../uploads/temp',
    // );

    // if (!fs.existsSync(modifiedPathToSaveAvatarTo)) {
    //   fs.mkdirSync(modifiedPathToSaveAvatarTo, { recursive: true });
    // }

    // const targetFilePath = path.join(
    //   modifiedPathToSaveAvatarTo,
    //   `${Date.now()}${file.originalname}`,
    // );

    // try {
    //   fs.writeFile(targetFilePath, file.buffer, () => {});
    //   console.log('Plik został zapisany w: ', targetFilePath);
    //   return {
    //     status: 'success',
    //   };
    // } catch (error) {
    //   console.error(error);
    //   return {
    //     status: 'error',
    //   };
    // }
  }
}
