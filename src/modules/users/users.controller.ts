import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateUser } from '~/modules/users/domain/use-cases/create-user';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { FindAllUsersDto } from '~/modules/users/dto/find-all-users.dto';
import { UpdateUserDto } from '~/modules/users/dto/update-user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly listUsers: ListUsers,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUser.execute(createUserDto);
  }

  @Get()
  findAll(@Query() query: FindAllUsersDto) {
    return this.listUsers.execute(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} user`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} user`;
  }
}
