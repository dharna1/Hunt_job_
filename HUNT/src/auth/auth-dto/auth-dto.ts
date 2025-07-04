import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsEqualTo } from '../../utils/IsEqualTo.validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  confirmPassword: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'email required' })
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password required' })
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  confirmPassword: string;

  @IsNotEmpty({ message: 'role required' })
  @IsArray()
  roles: string[];
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsArray()
  roles: string[];
}

export class UserParamsDto {
  @IsString()
  userId: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  confirmPassword: string;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  authorities: number[];
}

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  authorities: number[];
}

export class CreateAuthorityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateAuthorityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class RoleParamsDto {
  @Transform(({ value }) => Number(value))
  id: number;
}

export class AuthorityParamsDto {
  @Transform(({ value }) => Number(value))
  id: number;
}
