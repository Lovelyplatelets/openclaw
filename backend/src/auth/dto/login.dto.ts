import { Type } from 'class-transformer';
import { IsEmail, IsString, Length, ValidateNested } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 100)
  password!: string;
}

export class LoginRequestDto {
  @ValidateNested()
  @Type(() => LoginUserDto)
  user!: LoginUserDto;
}
