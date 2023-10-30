import { Conversation } from 'src/utils/entities/conversation.entity';
import { Message } from 'src/utils/entities/message.entity';
import { User } from 'src/utils/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import 'dotenv/config';
import { Avatar } from 'src/utils/entities/avatar.entity';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_DB,
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [User, Conversation, Message, Avatar],
  synchronize: true,
};
