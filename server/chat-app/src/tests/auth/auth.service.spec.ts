/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/utils/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('Auth Service LOGIN', () => {
  const usersServiceMock = {
    findUser: jest.fn().mockResolvedValue(null),
  } as unknown as UsersService;

  const jwtServiceMock = {
    signAsync: jest.fn(),
  } as unknown as JwtService;
  const authService = new AuthService(usersServiceMock, jwtServiceMock);

  it('should throw an error if user is not found in LOGIN ', async () => {
    const userDetails = {
      username: 'testuser',
      password: 'pasword1234',
    };

    await expect(async () => {
      await authService.signIn({} as Response, userDetails);
    }).rejects.toThrow('Invalid credentials');
  });
});

describe('Auth Service LOGIN', () => {
  const usersServiceMock = {
    findUser: jest.fn().mockResolvedValue(User),
  } as unknown as UsersService;

  const jwtServiceMock = {
    signAsync: jest
      .fn()
      .mockResolvedValueOnce('accesstoken') // Mock the access token
      .mockResolvedValueOnce('refreshtoken'),
  } as unknown as JwtService;
  const authService = new AuthService(usersServiceMock, jwtServiceMock);

  it('should throw an error if users password is INVALID ', async () => {
    const userDetails = {
      username: 'testuser',
      password: 'incorrectpasword1234',
    };
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false),
      await expect(async () => {
        await authService.signIn({} as Response, userDetails);
      }).rejects.toThrow('Invalid credentials');
  });

  it('should return accessToken and send res.cookie with refreshtoken ', async () => {
    const responseMock = {
      cookie: jest.fn(),
    } as unknown as Response;
    const userDetails = {
      username: 'testuser',
      password: 'incorrectpasword1234',
    };
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    const refreshToken = 'refreshtoken';
    const result = await authService.signIn(responseMock, userDetails);

    expect(result).toEqual('accesstoken');
    expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);
    expect(responseMock.cookie).toHaveBeenCalledWith('jwt', 'refreshtoken', {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
  });
});
