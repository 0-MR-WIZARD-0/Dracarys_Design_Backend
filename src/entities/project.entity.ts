import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Review } from './review.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: 'customization' | 'design' | 'web-development';

  @Column('text')
  description: string;

  @Column()
  previewImage: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @OneToOne(() => Review, (review) => review.project, {
    cascade: true,
    nullable: true,
  })
  review: Review;
}
