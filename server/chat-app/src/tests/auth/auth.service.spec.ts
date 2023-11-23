/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import e, { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/utils/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CustomRequest } from 'src/utils/types/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TokensService } from 'src/tokens/tokens.service';
import { ResetPasswordToken } from 'src/utils/entities/resetPasswordToken.entity';
import { VerifyUserEmailDto } from 'src/utils/dtos/VerifyUserEmailDto.dto';

describe('Auth Service LOGIN', () => {
  const usersServiceMock = {
    findUser: jest.fn().mockResolvedValue(null),
  } as unknown as UsersService;

  const jwtServiceMock = {
    signAsync: jest.fn(),
  } as unknown as JwtService;
  const tokenRepositoryMock = {} as any;
  const tokenServiceMock = {} as any;
  const authService = new AuthService(
    tokenServiceMock,
    usersServiceMock,
    jwtServiceMock,
    tokenRepositoryMock,
  );

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
  const tokenServiceMock = {} as unknown as TokensService;
  const tokenRepositoryMock = {
    save: jest.fn(),
  } as any;
  const authService = new AuthService(
    tokenServiceMock,
    usersServiceMock,
    jwtServiceMock,
    tokenRepositoryMock,
  );

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

describe('Auth Service handleRefreshToken METHOD ', () => {
  it('should  throw Unauthorized if cookies.jwt is not found', async () => {
    const usersServiceMock = {
      findUser: jest.fn().mockResolvedValue(User),
    } as unknown as UsersService;

    const jwtServiceMock = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as unknown as JwtService;
    const tokenServiceMock = {} as unknown as TokensService;
    const tokenRepositoryMock = {} as any;
    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );
    const reqMock = {
      cookies: {
        jwt: null,
      },
      user: {
        username: 'user123',
      },
    };

    try {
      await authService.handleRefreshToken(reqMock as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Unauthorized');
      expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    }
  });
  it('should  throw Unauthorized if payload doesnt match with user', async () => {
    const usersServiceMock = {
      findUser: jest.fn().mockResolvedValue(User),
    } as unknown as UsersService;

    const jwtServiceMock = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn().mockResolvedValue({
        username: 'different_user',
      }),
    } as unknown as JwtService;
    const tokenServiceMock = {} as unknown as TokensService;
    const tokenRepositoryMock = {} as any;
    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );
    const reqMock = {
      cookies: {
        jwt: 'refreshtoken',
      },
      user: {
        username: 'user123',
      },
    };

    try {
      await authService.handleRefreshToken(reqMock as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Unauthorized');
      expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    }
  });
  it('should return access token by giving refreshtoken', async () => {
    const usersServiceMock = {
      findUser: jest.fn().mockResolvedValue(User),
    } as unknown as UsersService;
    const tokenServiceMock = {} as unknown as TokensService;

    const jwtServiceMock = {
      signAsync: jest.fn().mockResolvedValue('accesstoken'),
      verifyAsync: jest.fn().mockResolvedValue({
        username: 'user123',
      }),
    } as unknown as JwtService;
    const tokenRepositoryMock = {} as any;

    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );
    const reqMock = {
      cookies: {
        jwt: 'refreshtoken',
      },
      user: {
        username: 'user123',
      },
    };

    const result = await authService.handleRefreshToken(reqMock as any);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('username');
    expect(result.accessToken).toEqual('accesstoken');
    expect(result.username).toEqual('user123');
  });
});

describe(`Auth controller verifyEmail`, () => {
  it('should return message if user is not found ', async () => {
    const tokenServiceMock = {} as unknown as TokensService;
    const jwtServiceMock = {} as any;
    const tokenRepositoryMock = {
      save: jest.fn(),
    } as any;
    const usersServiceMock = {
      findUser: jest.fn().mockResolvedValue(null),
    } as any;
    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );
    const verifyUserEmailDto: VerifyUserEmailDto = {
      email: 'lalala123',
    };
    const result = await authService.sendResetPasswordEmail(verifyUserEmailDto);

    expect(result).toHaveProperty('message');
    expect(result.message).toEqual(
      `If matching account was found an email was sent to ${verifyUserEmailDto.email}`,
    );
  });

  it('should return message if account is found with given mail', async () => {
    const uniqueResetTokenMock = '1235';
    const tokenServiceMock = {} as unknown as TokensService;
    const jwtServiceMock = {} as any;
    const tokenRepositoryMock = {
      save: jest.fn(),
    } as any;
    const verifyUserEmailDto: VerifyUserEmailDto = {
      email: 'lalala123',
    };
    const userMock = {
      username: 'ikspispi',
      password: 'pasword123',
      email: verifyUserEmailDto.email,
    } as any;
    const usersServiceMock = {
      sendEmail: jest.fn(),
      findUser: jest.fn().mockResolvedValue(userMock),
    } as any;
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => hash);
    const hash = 'hashedToken';
    const resetPasswordTokenMock = new ResetPasswordToken();
    resetPasswordTokenMock.token = hash;
    resetPasswordTokenMock.user = userMock;
    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );

    const result = await authService.sendResetPasswordEmail(verifyUserEmailDto);
    expect(result).toHaveProperty('message');
    expect(result.message).toEqual(
      `If matching account was found an email was sent to ${verifyUserEmailDto.email}`,
    );
  });
});

describe('Auth service changePasswordMethod', () => {
  it('should throw error if passwordToken is not found in Database', async () => {
    const tokenServiceMock = {
      getTokenByUserId: jest.fn(null),
    } as any;
    const usersServiceMock = {} as any;
    const jwtServiceMock = {} as any;
    const tokenRepositoryMock = {} as any;

    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );

    const dtoMock = {
      password: '12345679',
      confirmPassword: '12345679',
      userId: 1,
      token: 'tokenxp',
    };

    try {
      await authService.changePassword(dtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Invalid or expired reset password token');
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('should throw an error if token compared to hashed token is not valid', async () => {
    const passwordTokenInDbMock = {
      token: '1234567',
      userId: 1,
    };

    const tokenServiceMock = {
      getTokenByUserId: jest.fn().mockResolvedValue(passwordTokenInDbMock),
    } as any;
    const usersServiceMock = {} as any;
    const jwtServiceMock = {} as any;
    const tokenRepositoryMock = {} as any;

    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );

    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

    const dtoMock = {
      password: '12345679',
      confirmPassword: '12345679',
      userId: 1,
      token: 'tokenxp',
    };

    try {
      await authService.changePassword(dtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Invalid or expired reset password token');
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('should throw an error if user is not found in database', async () => {
    const passwordTokenInDbMock = {
      token: 'tokenxp',
      userId: 1,
    };

    const tokenServiceMock = {
      getTokenByUserId: jest.fn().mockResolvedValue(passwordTokenInDbMock),
    } as any;
    const usersServiceMock = {
      findUser: jest.fn().mockResolvedValue(null),
    } as any;
    const jwtServiceMock = {} as any;
    const tokenRepositoryMock = {} as any;

    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );

    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

    const dtoMock = {
      password: '12345679',
      confirmPassword: '12345679',
      userId: 1,
      token: 'tokenxp',
    };
    const hashedPasswordMock = 'hashedpassword';
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPasswordMock);

    try {
      await authService.changePassword(dtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('User not found');
      expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('should return message if password is changed succesfully', async () => {
    const passwordTokenInDbMock = {
      token: 'tokenxp',
      userId: 1,
    };
    const dtoMock = {
      password: '12345679',
      confirmPassword: '12345679',
      userId: 1,
      token: 'tokenxp',
    };
    const userMock = {
      id: 1,
      password: dtoMock.password,
    };

    const tokenServiceMock = {
      getTokenByUserId: jest.fn().mockResolvedValue(passwordTokenInDbMock),
    } as any;
    const usersServiceMock = {
      findUser: jest.fn().mockResolvedValue(userMock),
      saveUser: jest.fn(),
    } as any;
    const jwtServiceMock = {} as any;
    const tokenRepositoryMock = {} as any;

    const authService = new AuthService(
      tokenServiceMock,
      usersServiceMock,
      jwtServiceMock,
      tokenRepositoryMock,
    );

    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

    const hashedPasswordMock = 'hashedpassword';
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPasswordMock);

    const result = await authService.changePassword(dtoMock);

    expect(result).toHaveProperty('message');
    expect(result.message).toEqual('Password changed successfully');
  });
});
