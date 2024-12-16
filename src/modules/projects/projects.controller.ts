import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Patch,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  multerStorage,
  fileFilter,
  fileFieldsConfig,
} from '../../../config/multer.config';
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
    FileFieldsInterceptor(fileFieldsConfig, {
      storage: multerStorage,
      fileFilter,
    }),
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
      throw new BadRequestException('Превью-изображение обязательно!');
    }
    if (!files.images || files.images.length !== 3) {
      throw new BadRequestException(
        'Должно быть загружено ровно 3 изображения!',
      );
    }

    createProjectDto.previewImage = `/uploads/${files.previewImage[0].filename}`;
    createProjectDto.images = files.images.map(
      (file) => `/uploads/${file.filename}`,
    );

    return this.projectsService.create(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(fileFieldsConfig, {
      storage: multerStorage,
      fileFilter,
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFiles()
    files: {
      previewImage?: Multer.File[];
      images?: Multer.File[];
    },
  ) {
    const existingProject = await this.projectsService.findOne(id);
    if (!existingProject) {
      throw new NotFoundException(`Проект с ID ${id} не найден.`);
    }

    const preparedDto = this.prepareFilesForDto(
      updateProjectDto,
      files,
      existingProject,
    );
    return this.projectsService.update(id, preparedDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.projectsService.remove(id);
  }

  private validateFiles(files: {
    previewImage?: Multer.File[];
    images?: Multer.File[];
  }) {
    if (!files.previewImage || files.previewImage.length === 0) {
      throw new BadRequestException('Превью-изображение обязательно!');
    }
    if (!files.images || files.images.length !== 3) {
      throw new BadRequestException(
        'Должно быть загружено ровно 3 изображения!',
      );
    }
  }

  private prepareFilesForDto(
    dto: CreateProjectDto | UpdateProjectDto,
    files: { previewImage?: Multer.File[]; images?: Multer.File[] },
    existingProject?: { previewImage: string; images: string[] },
  ) {
    dto.previewImage = files.previewImage?.length
      ? `/uploads/${files.previewImage[0].filename}`
      : existingProject?.previewImage;

    dto.images = files.images?.length
      ? files.images.map((file) => `/uploads/${file.filename}`)
      : existingProject?.images || [];

    return dto;
  }
}
