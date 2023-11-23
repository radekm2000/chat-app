import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/utils/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDetails } from 'src/utils/types/types';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, // private tokenService: TokensService,
  ) {}

  async createUser(userDetails: CreateUserDetails): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: userDetails.username }, { email: userDetails.email }],
    });

    if (existingUser) {
      if (existingUser.username === userDetails.username) {
        throw new HttpException(
          `User ${userDetails.username} already exists`,
          HttpStatus.CONFLICT,
        );
      } else if (existingUser.email === userDetails.email) {
        throw new HttpException(
          `An email has already been taken`,
          HttpStatus.CONFLICT,
        );
      }
    }

    const newUser = this.userRepository.create(userDetails);

    return this.saveUser(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'username'],
    });
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findUser(
    findUserParams: Partial<{ username: string; id: number; email: string }>,
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username: findUserParams.username,
        id: findUserParams.id,
        email: findUserParams.email,
      },
      relations: ['messages', 'avatar'],
    });
  }

  async findUserIdByNickname(
    findUserParams: Partial<{ username: string; id: number }>,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        username: findUserParams.username,
      },
    });
    if (user) {
      console.log('podayn nickname', findUserParams.username);
      console.log('id usera', user.id);
      return user.id;
    }
    return null;
  }

  async searchUserByName(query: string) {
    const users = await this.userRepository.find({
      where: {
        username: Like(`%${query}%`),
      },
      select: ['id', 'username'],
    });
    if (!users) {
      return 'No user found';
    }
    return users;
  }

  async sendEmail(user: User, uniqueResetToken: string) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_EMAIL_PASSWORD,
        },
      });

      const htmlContent = `Reset your password at: <a href="http://localhost:5173/resetPassword/${uniqueResetToken}/${user.id}">Click here</a>`;

      const mail_configs = {
        from: process.env.MY_EMAIL,
        to: user.email,
        subject: 'Resetting password',
        html: htmlContent,
      };

      transporter.sendMail(mail_configs, (error) => {
        if (error) {
          console.log(error);
          return reject({ message: 'an error occured' });
        }
        return resolve({
          message: `Email sent succesfully to ${mail_configs.to} `,
        });
      });
    });
  }
}
