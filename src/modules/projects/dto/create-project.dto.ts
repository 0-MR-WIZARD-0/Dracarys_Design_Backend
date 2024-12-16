import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: 'customization' | 'design' | 'web-development';

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  previewImage?: string;

  @IsOptional()
  images?: string[];
}
