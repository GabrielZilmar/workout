import { Provider } from '@nestjs/common';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionDomain from '~/modules/session/domain/session.domain';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';

type GetTokenRepositoryProviderParams = {
  tokenRepositoryMock?: TokenRepository;
  sessionDomain?: SessionDomain | null;
};

const getTokenRepositoryProvider = ({
  tokenRepositoryMock,
  sessionDomain = null,
}: GetTokenRepositoryProviderParams = {}) => {
  return {
    provide: TokenRepository,
    useFactory: (sessionMapper: SessionMapper) => {
      if (!tokenRepositoryMock) {
        const findLastByUserIdAndTypedMock = jest
          .fn()
          .mockResolvedValue(sessionDomain);
        tokenRepositoryMock = new TokenRepository(sessionMapper) as jest.Mocked<
          InstanceType<typeof TokenRepository>
        >;
        tokenRepositoryMock.findLastByUserIdAndType =
          findLastByUserIdAndTypedMock;
      }

      return tokenRepositoryMock;
    },
    inject: [SessionMapper],
  } as Provider;
};

export default getTokenRepositoryProvider;
