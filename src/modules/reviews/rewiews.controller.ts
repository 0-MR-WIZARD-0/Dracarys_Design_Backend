import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './rewiews.service';
import { Review } from '../../entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(@Body() data: Partial<Review>): Promise<Review> {
    return this.reviewsService.createReview(data);
  }

  @Get()
  async getAllReviews(): Promise<Review[]> {
    return this.reviewsService.getAllReviews();
  }

  @Patch(':id/approve')
  async approveReview(@Param('id') id: number): Promise<Review> {
    return this.reviewsService.approveReview(+id);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: number): Promise<void> {
    return this.reviewsService.deleteReview(+id);
  }
}
