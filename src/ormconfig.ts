import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

console.log(`path: `, path.join(__dirname, '/entities/**/*{.ts,.js}'))

const isProduction = process.env.NODE_ENV === 'production';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  entities: [path.join(__dirname, 'entities/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations/**/*{.ts,.js}')],

  migrationsTableName: 'migrations',
  migrationsRun: isProduction,

  synchronize: !isProduction,
  logging: process.env.NODE_ENV !== 'production',
  ssl: false 
});

export default AppDataSource;
