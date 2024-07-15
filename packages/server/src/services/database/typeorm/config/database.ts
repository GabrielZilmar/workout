import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: '.env',
});

const getDatabasePort = () => Number((process.env.DB_PORT as string) || 0);

const databaseConfig = {
  databaseHost: process.env.DATABASE_HOST as string,
  get port() {
    return getDatabasePort();
  },
  username: process.env.USERNAME as string,
  password: process.env.PASSWORD as string,
  database: process.env.DATABASE as string,
};

export default databaseConfig;
