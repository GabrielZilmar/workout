import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '~/module/users/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
