import { IsNumber, IsString, IsUUID } from 'class-validator';
import { UserDomain } from '~/modules/users/domain/users.domain';

export class UserDto {
  @IsUUID()
  id: string;

  @IsUUID()
  ssoId: string;

  @IsString()
  username: string;

  @IsNumber()
  age: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  public static domainToDto(domain: UserDomain): UserDto {
    const { id, ssoId, username, age, weight, height } = domain;

    const userDto = new UserDto();
    userDto.id = id?.toString() || null;
    userDto.ssoId = ssoId.value;
    userDto.username = username.value;
    userDto.age = age.value;
    userDto.weight = weight.value;
    userDto.height = height.value;

    return userDto;
  }
}
