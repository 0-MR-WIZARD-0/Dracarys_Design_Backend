import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-rewiew.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateReviewDto } from './dto/update-rewiew.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([]))
  create(@Body() CreateReviewDto: CreateReviewDto) {
    return this.reviewsService.create(CreateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewsService.remove(+id);
  }
}
