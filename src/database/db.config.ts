import * as dotenv from 'dotenv';
import { DatabaseConfig } from './db.config.interface';

dotenv.config();

export const databaseConfig: DatabaseConfig = {
  user: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.USER_DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
  contact: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE_CONTACT,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
  netbanking: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.NETBANKING_DATABASE_URL,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
  indbank: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE_BANK,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
};
