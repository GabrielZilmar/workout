import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CreateUser } from '~/modules/users/domain/use-cases/create-user';
import { GetUser } from '~/modules/users/domain/use-cases/get-user';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';
import { UpdateUser } from '~/modules/users/domain/use-cases/update-user';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { FindAllUsersDto } from '~/modules/users/dto/find-all-users.dto';
import { GetUserDto } from '~/modules/users/dto/get-user.dto';
import {
  CreateUserParamsDto,
  UpdateUserBodyDto,
} from '~/modules/users/dto/update-user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly listUsers: ListUsers,
    private readonly getUser: GetUser,
    private readonly updateUser: UpdateUser,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUser.execute(createUserDto);
  }

  @Get()
  findAll(@Query() query: FindAllUsersDto) {
    return this.listUsers.execute(query);
  }

  @Get(':idOrUsername')
  findOne(@Param() idOrUsername: GetUserDto) {
    return this.getUser.execute(idOrUsername);
  }

  @Put(':id')
  update(
    @Param() id: CreateUserParamsDto,
    @Body() updateUserDto: UpdateUserBodyDto,
  ) {
    return this.updateUser.execute({
      ...id,
      ...updateUserDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} user`;
  }
}
