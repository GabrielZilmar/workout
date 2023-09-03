import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import databaseConfig from '~/service/database/typeorm/config/database';

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
  entities: ['src/modules/**/entities/*{.ts,.js}'],
  migrations: ['src/services/database/typeorm/migrations/*{.ts,.js}'],
  subscribers: ['src/services/database/typeorm/subscribers/*{.ts,.js}'],
} as DataSourceOptions;

export const AppDataSource = new DataSource(dataSourceOptions);
