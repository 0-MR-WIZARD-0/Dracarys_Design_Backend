import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqDto } from './create-faq.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {
  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  answer?: string;
}
