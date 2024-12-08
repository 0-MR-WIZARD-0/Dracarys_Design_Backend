import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async createReview(data: Partial<Review>): Promise<Review> {
    const review = this.reviewRepository.create(data);
    return this.reviewRepository.save(review);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewRepository.find();
  }

  async approveReview(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOneOrFail({ where: { id } });
    review.isApproved = true;
    return this.reviewRepository.save(review);
  }

  async deleteReview(id: number): Promise<void> {
    await this.reviewRepository.delete(id);
  }
}
