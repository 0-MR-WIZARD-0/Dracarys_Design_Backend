import {
  IsString,
  IsEnum,
  IsArray,
  IsNotEmpty,
  ArrayMaxSize,
} from 'class-validator';

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
  @ArrayMaxSize(3, { message: 'Можно загрузить максимум 3 изображения.' })
  @IsString({ each: true })
  images: string[];
}
