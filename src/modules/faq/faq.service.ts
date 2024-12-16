import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from '../../entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async findAll(): Promise<Faq[]> {
    try {
      const faqs = await this.faqRepository.find();
      if (faqs.length === 0) {
        throw new NotFoundException('Записи отсутствуют');
      }
      return faqs;
    } catch (error) {
      throw new Error(`Ошибка при получении списка FAQ: ${error.message}`);
    }
  }

  async create(createFaqDto: CreateFaqDto): Promise<Faq> {
    try {
      const faq = this.faqRepository.create(createFaqDto);
      return await this.faqRepository.save(faq);
    } catch (error) {
      throw new Error(`Ошибка при создании FAQ: ${error.message}`);
    }
  }

  async update(id: number, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    try {
      const faq = await this.faqRepository.findOneBy({ id });
      if (!faq) {
        throw new NotFoundException(`FAQ с id ${id} не найден`);
      }
      if (Object.keys(updateFaqDto).length === 0) {
        throw new BadRequestException('Обновление невозможно: нет данных');
      }
      Object.assign(faq, updateFaqDto);
      return await this.faqRepository.save(faq);
    } catch (error) {
      throw new Error(`Ошибка при обновлении FAQ с id ${id}: ${error.message}`);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const faq = await this.faqRepository.findOneBy({ id });
      if (!faq) {
        throw new NotFoundException(`FAQ с id ${id} не найден`);
      }
      await this.faqRepository.delete(id);
      return { message: `FAQ с id ${id} успешно удален` };
    } catch (error) {
      throw new Error(`Ошибка при удалении FAQ с id ${id}: ${error.message}`);
    }
  }
}
