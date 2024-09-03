import { ConfigModule } from '@nestjs/config';
import { Environment } from '~/shared/env';

ConfigModule.forRoot({
  envFilePath: '.env',
});
const NODE_ENV = process.env.NODE_ENV;

const getDatabasePort = () => Number((process.env.DB_PORT as string) || 0);

const databaseConfig = {
  databaseHost: process.env.DATABASE_HOST as string,
  get port() {
    return getDatabasePort();
  },
  username: process.env.USERNAME as string,
  password: process.env.PASSWORD as string,
  database: process.env.DATABASE as string,
  ssl: NODE_ENV === Environment.PROD,
  extra:
    NODE_ENV === Environment.PROD
      ? { ssl: { rejectUnauthorized: false } }
      : undefined,
};

export default databaseConfig;
