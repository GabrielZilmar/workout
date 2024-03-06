import { Provider } from '@nestjs/common';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';

const getTokenRepositoryProvider = (tokenRepositoryMock?: TokenRepository) =>
  ({
    provide: TokenRepository,
    useFactory: (sessionMapper: SessionMapper) => {
      if (!tokenRepositoryMock) {
        const findLastByUserIdAndTypedMock = jest.fn().mockResolvedValue(null);
        tokenRepositoryMock = new TokenRepository(sessionMapper) as jest.Mocked<
          InstanceType<typeof TokenRepository>
        >;
        tokenRepositoryMock.findLastByUserIdAndType =
          findLastByUserIdAndTypedMock;
      }

      return tokenRepositoryMock;
    },
    inject: [SessionMapper],
  } as Provider);

export default getTokenRepositoryProvider;
