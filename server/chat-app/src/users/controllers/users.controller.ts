import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { UsersService } from '../services/users.service';
import { FindUserParams } from 'src/utils/types/types';
import { Public } from 'src/auth/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as sharp from 'sharp';
import * as path from 'path';
import { multerOptions } from 'src/upload/single-upload-disk';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/utils/entities/user.entity';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from 'src/main';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from 'src/utils/entities/avatar.entity';
import { Repository } from 'typeorm';
const bucketName = process.env.BUCKET_NAME;

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Avatar) private avatarRepository: Repository<Avatar>,
  ) {}

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

  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(@AuthUser() user: User, @UploadedFile() file) {
    const buffer = await sharp(file.buffer)
      .resize({
        height: 64,
        width: 64,
        fit: 'contain',
      })
      .toBuffer();
    const imageName = `${uuid()}${file.originalname}`;
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: file.mimetype,
    };

    const existingUser = await this.usersService.findUser({ id: user.id });
    if (!existingUser) {
      throw new HttpException(
        'Cannot find user with that id',
        HttpStatus.BAD_REQUEST,
      );
    }
    const avatar = new Avatar();
    avatar.imageName = imageName;
    await this.avatarRepository.save(avatar);

    existingUser.avatar = avatar;
    await this.usersService.saveUser(existingUser);

    const command = new PutObjectCommand(params);
    await s3.send(command);
  }
}
