import { User } from 'src/utils/entities/user.entity';
import { CreateUserDetails, FindUserParams } from 'src/utils/types/types';

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>;
  getAllUsers(): Promise<User[]>;
  findUser(findUserParams: FindUserParams): Promise<User>;
  saveUser(user: User): Promise<User>;
}
