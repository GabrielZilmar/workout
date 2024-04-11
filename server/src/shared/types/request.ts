import { UserDto } from '~/modules/users/dto/user.dto';

export type RequestWithUser = Request & { user: UserDto };
