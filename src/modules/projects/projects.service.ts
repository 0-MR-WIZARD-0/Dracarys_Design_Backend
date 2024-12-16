import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    try {
      const projects = await this.projectsRepository.find();
      if (projects.length === 0) {
        throw new NotFoundException('Проекты не найдены');
      }
      return projects;
    } catch (error) {
      throw new Error(`Ошибка при получении списка проектов: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Project> {
    try {
      const project = await this.projectsRepository.findOne({ where: { id } });
      if (!project) {
        throw new NotFoundException(`Проект с ID ${id} не найден`);
      }
      return project;
    } catch (error) {
      throw new Error(
        `Ошибка при получении проекта с ID ${id}: ${error.message}`,
      );
    }
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      if (!createProjectDto.name || !createProjectDto.category) {
        throw new BadRequestException(
          'Имя проекта и категория являются обязательными',
        );
      }

      const project = this.projectsRepository.create(createProjectDto);
      return await this.projectsRepository.save(project);
    } catch (error) {
      throw new Error(`Ошибка при создании проекта: ${error.message}`);
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    try {
      const project = await this.projectsRepository.findOne({ where: { id } });

      if (!project) {
        throw new NotFoundException(`Проект с ID ${id} не найден`);
      }

      if (Object.keys(updateProjectDto).length === 0) {
        throw new BadRequestException('Нет данных для обновления');
      }

      Object.assign(project, updateProjectDto);

      return await this.projectsRepository.save(project);
    } catch (error) {
      throw new Error(
        `Ошибка при обновлении проекта с ID ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const project = await this.findOne(id);
      await this.projectsRepository.remove(project);
      return { message: `Проект с ID ${id} успешно удален` };
    } catch (error) {
      throw new Error(
        `Ошибка при удалении проекта с ID ${id}: ${error.message}`,
      );
    }
  }
}
