import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-rewiew.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
