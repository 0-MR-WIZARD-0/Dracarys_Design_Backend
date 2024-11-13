import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @Column('simple-array')
  images: string[];

  @OneToMany(() => Review, (review) => review.project, { cascade: true })
  reviews: Review[];
}
