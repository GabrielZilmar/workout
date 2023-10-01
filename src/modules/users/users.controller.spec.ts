import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '~/modules/users/users.controller';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import UseCaseProviders from '~/modules/users/domain/use-cases/provider';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserRepository, UserMapper, ...UseCaseProviders],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
