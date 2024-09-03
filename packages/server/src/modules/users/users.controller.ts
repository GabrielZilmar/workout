import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '~/guards/auth.guard';
import { UserDataGuard } from '~/guards/user-data.guard';
import { CreateUser } from '~/modules/users/domain/use-cases/create-user';
import { DeleteUser } from '~/modules/users/domain/use-cases/delete-user';
import { GetMe } from '~/modules/users/domain/use-cases/get-me';
import { GetUser } from '~/modules/users/domain/use-cases/get-user';
import { IsEmailAvailable } from '~/modules/users/domain/use-cases/is-email-available';
import { IsUsernameAvailable } from '~/modules/users/domain/use-cases/is-username-available';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';
import { UpdateUser } from '~/modules/users/domain/use-cases/update-user';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { DeleteUserParamsDto } from '~/modules/users/dto/delete-user.dto';
import { FindAllUsersDto } from '~/modules/users/dto/find-all-users.dto';
import { GetUserDto } from '~/modules/users/dto/get-user.dto';
import { IsEmailAvailableQueryDTO } from '~/modules/users/dto/is-email-available.dto';
import { IsUsernameAvailableQueryDTO } from '~/modules/users/dto/is-username-available.dto';
import {
  CreateUserParamsDto,
  UpdateUserBodyDto,
} from '~/modules/users/dto/update-user.dto';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly listUsers: ListUsers,
    private readonly getUser: GetUser,
    private readonly updateUser: UpdateUser,
    private readonly deleteUser: DeleteUser,
    private readonly getMeUseCase: GetMe,
    private readonly isEmailAvailableUseCase: IsEmailAvailable,
    private readonly isUsernameAvailableUseCase: IsUsernameAvailable,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUser.execute(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FindAllUsersDto) {
    return this.listUsers.execute(query);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.getMeUseCase.execute({ userId });
  }

  @Get('/is-email-available')
  isEmailAvailable(@Query() { email }: IsEmailAvailableQueryDTO) {
    return this.isEmailAvailableUseCase.execute({ email });
  }

  @Get('/is-username-available')
  isUsernameAvailable(@Query() { username }: IsUsernameAvailableQueryDTO) {
    return this.isUsernameAvailableUseCase.execute({ username });
  }

  @Get(':idOrUsername')
  @UseGuards(AuthGuard)
  findOne(@Req() req: RequestWithUser, @Param() { idOrUsername }: GetUserDto) {
    const userId = req.user.id;
    return this.getUser.execute({ userId, idOrUsername });
  }

  @Patch(':id')
  @UseGuards(AuthGuard, UserDataGuard)
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
  @UseGuards(AuthGuard, UserDataGuard)
  remove(@Param() params: DeleteUserParamsDto) {
    return this.deleteUser.execute(params);
  }
}
