import { User } from 'src/utils/entities/user.entity';
import { CreateUserDetails } from 'src/utils/types/types';

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>;
}
