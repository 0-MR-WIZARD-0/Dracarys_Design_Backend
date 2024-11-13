// src/projects/dto/create-project.dto.ts
import { IsString, IsEnum, IsArray, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['customization', 'design', 'web-development'])
  category: 'customization' | 'design' | 'web-development';

  @IsString()
  description: string;

  @IsString()
  previewImage: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
