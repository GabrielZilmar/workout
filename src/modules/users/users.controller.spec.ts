import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '~/modules/users/users.service';
import { UsersController } from '~/modules/users/users.controller';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, UserRepository, UserMapper],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
