import { Type } from 'class-transformer';
import { IsString, Length, ValidateNested } from 'class-validator';

export class CreateCommentPayloadDto {
  @IsString()
  @Length(1, 10000)
  body!: string;
}

export class CreateCommentRequestDto {
  @ValidateNested()
  @Type(() => CreateCommentPayloadDto)
  comment!: CreateCommentPayloadDto;
}
