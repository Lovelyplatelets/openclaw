import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class UpdateUserPayloadDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(3, 32)
  username?: string;

  @IsOptional()
  @IsString()
  bio?: string | null;

  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;
}

export class UpdateUserRequestDto {
  @ValidateNested()
  @Type(() => UpdateUserPayloadDto)
  user!: UpdateUserPayloadDto;
}
