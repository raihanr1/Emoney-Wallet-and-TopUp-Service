import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Balance } from './entity/Balance';
import { Transaction } from './entity/Transaction';
import { User } from './entity/User';
import * as dotenv from 'dotenv';
dotenv.config();
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: true,
  logger: 'simple-console',
  entities: [User, Balance, Transaction],
  migrationsRun: true,
  migrations: [],
  subscribers: [],
});
