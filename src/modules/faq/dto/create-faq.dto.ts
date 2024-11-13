// src/faq/dto/create-faq.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  answer: string;
}
