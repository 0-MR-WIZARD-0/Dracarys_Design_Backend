import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Multer } from 'multer';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'previewImage', maxCount: 1 },
        { name: 'images', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            callback(null, true);
          } else {
            callback(
              new BadRequestException('Разрешены только изображения!'),
              false,
            );
          }
        },
      },
    ),
  )
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles()
    files: {
      previewImage?: Multer.File[];
      images?: Multer.File[];
    },
  ) {
    if (!files.previewImage || files.previewImage.length === 0) {
      throw new BadRequestException('Превью изображение обязательно.');
    }

    const previewImagePath = `/uploads/${files.previewImage[0].filename}`;
    createProjectDto.previewImage = previewImagePath;

    if (files.images && files.images.length > 0) {
      const imagesPaths = files.images.map(
        (file) => `/uploads/${file.filename}`,
      );
      createProjectDto.images = imagesPaths;
    } else {
      createProjectDto.images = [];
    }

    return this.projectsService.create(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.projectsService.remove(id);
  }
}
