import { Type } from 'class-transformer';
import { IsEmail, IsString, Length, ValidateNested } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(3, 32)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 100)
  password!: string;
}

export class RegisterRequestDto {
  @ValidateNested()
  @Type(() => RegisterUserDto)
  user!: RegisterUserDto;
}
