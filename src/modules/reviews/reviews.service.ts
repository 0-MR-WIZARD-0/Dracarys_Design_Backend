import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Project } from 'src/entities/project.entity';
import { CreateReviewDto } from './dto/create-rewiew.dto';
import { UpdateReviewDto } from './dto/update-rewiew.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Review[]> {
    try {
      const reviews = await this.reviewsRepository.find({
        relations: ['project'],
      });
      if (reviews.length === 0) {
        throw new NotFoundException('Отзывы не найдены');
      }
      return reviews;
    } catch (error) {
      throw new Error(`Ошибка при получении отзывов: ${error.message}`);
    }
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const project = await this.projectsRepository.findOne({
        where: { id: createReviewDto.projectId },
        relations: ['review'],
      });

      if (!project) {
        throw new NotFoundException('Проект не найден!');
      }

      if (project.review) {
        throw new BadRequestException('Отзыв на данный проект уже существует');
      }

      const review = this.reviewsRepository.create({
        ...createReviewDto,
        project,
      });

      return await this.reviewsRepository.save(review);
    } catch (error) {
      throw new Error(`Ошибка при создании отзыва: ${error.message}`);
    }
  }

  async approveReview(id: number): Promise<Review> {
    try {
      const review = await this.reviewsRepository.findOne({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException(`Отзыв с ID ${id} не найден`);
      }

      review.isApproved = true;

      return await this.reviewsRepository.save(review);
    } catch (error) {
      throw new Error(
        `Ошибка при подтверждении отзыва с ID ${id}: ${error.message}`,
      );
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.reviewsRepository.findOne({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException('Отзыв не найден');
      }

      if (Object.keys(updateReviewDto).length === 0) {
        throw new BadRequestException('Нет данных для обновления');
      }

      const updatedReview = this.reviewsRepository.merge(
        review,
        updateReviewDto,
      );

      return await this.reviewsRepository.save(updatedReview);
    } catch (error) {
      throw new Error(
        `Ошибка при обновлении отзыва с ID ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const review = await this.reviewsRepository.findOne({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException('Отзыв не найден');
      }

      await this.reviewsRepository.remove(review);

      return { message: `Отзыв с ID ${id} успешно удален` };
    } catch (error) {
      throw new Error(
        `Ошибка при удалении отзыва с ID ${id}: ${error.message}`,
      );
    }
  }
}
