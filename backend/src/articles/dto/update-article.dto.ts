import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class UpdateArticlePayloadDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100000)
  body?: string;

  @IsOptional()
  @IsArray()
  tagList?: string[];
}

export class UpdateArticleRequestDto {
  @ValidateNested()
  @Type(() => UpdateArticlePayloadDto)
  article!: UpdateArticlePayloadDto;
}
