import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/utils/entities/user.entity';
import { Repository } from 'typeorm';
import { IUserService } from '../interfaces/user';
import { CreateUserDetails } from 'src/utils/types/types';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(userDetails: CreateUserDetails): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        username: userDetails.username,
      },
    });

    if (existingUser) {
      throw new HttpException(
        `User ${userDetails.username} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const newUser = this.userRepository.create(userDetails);

    return this.saveUser(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({});
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findUser(
    findUserParams: Partial<{ username: string; id: number }>,
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username: findUserParams.username,
        id: findUserParams.id,
      },
      relations: ['messages'],
    });
  }
}
