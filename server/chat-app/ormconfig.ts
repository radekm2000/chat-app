import { Conversation } from 'src/utils/entities/conversation.entity';
import { Message } from 'src/utils/entities/message.entity';
import { User } from 'src/utils/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import 'dotenv/config';
import { Avatar } from 'src/utils/entities/avatar.entity';
import { ResetPasswordToken } from 'src/utils/entities/resetPasswordToken.entity';
import { FriendRequest } from 'src/utils/entities/friendRequest.entity';
import { Friend } from 'src/utils/entities/friend.entity';
import { DataSource } from 'typeorm';

export let config: PostgresConnectionOptions;
if (process.env.IS_PRODUCTION === 'true') {
  config = {
    type: 'postgres',
    database: 'railway',
    host: 'monorail.proxy.rlwy.net',
    port: 51208,
    username: 'postgres',
    password: 'daE36a*BgA36G4CEe2BaDCBFFCdDaB*B',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
  };
} else {
  config = {
    type: 'postgres',
    database: process.env.POSTGRES_DB,
    host: 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    entities: [
      User,
      Conversation,
      Message,
      Avatar,
      ResetPasswordToken,
      FriendRequest,
      Friend,
    ],
    synchronize: true,
  };
}

export const dataSource = new DataSource(config);
