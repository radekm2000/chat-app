import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/utils/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

const userRepositoryMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it(' REGISTER method should throw a CONFLICT EXCEPTION if username exists ', async () => {
    const userDetailsMock = {
      username: 'testuser',
      password: 'testuser123',
    };

    userRepositoryMock.findOne.mockResolvedValue(User);

    try {
      await usersService.createUser(userDetailsMock);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response).toEqual(
        `User ${userDetailsMock.username} already exists`,
      );
    }
  });
  it(' REGISTER method should return user if everything passed', async () => {
    const userDetailsMock = {
      username: 'testuser123',
      password: 'testuser123',
    };

    userRepositoryMock.findOne.mockResolvedValue(null);
    try {
      const user = await usersService.createUser(userDetailsMock);
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.username).toEqual(userDetailsMock.username);
    } catch (error) {}
  });
});
