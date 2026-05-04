import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class CreateArticlePayloadDto {
  @IsString()
  @Length(1, 200)
  title!: string;

  @IsString()
  @Length(1, 500)
  description!: string;

  @IsString()
  @Length(1, 100000)
  body!: string;

  @IsOptional()
  @IsArray()
  tagList?: string[];
}

export class CreateArticleRequestDto {
  @ValidateNested()
  @Type(() => CreateArticlePayloadDto)
  article!: CreateArticlePayloadDto;
}
