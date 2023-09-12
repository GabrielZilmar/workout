import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import databaseConfig from '~/services/database/typeorm/config/database';

export const dataSourceOptions = {
  type: 'postgres',
  url: databaseConfig.databaseUrl,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  synchronize: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [join(__dirname, '../../../../modules/**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  subscribers: [join(__dirname, '../subscribers/*{.ts,.js}')],
} as DataSourceOptions;

export const AppDataSource = new DataSource(dataSourceOptions);
