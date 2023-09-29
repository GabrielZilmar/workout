import { Test, TestingModule } from '@nestjs/testing';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UsersService } from '~/modules/users/users.service';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UserRepository, UserMapper],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
