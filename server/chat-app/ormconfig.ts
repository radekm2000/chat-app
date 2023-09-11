import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'POSTGRES_DB',
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [],
  synchronize: true,
};
