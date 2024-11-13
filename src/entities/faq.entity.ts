import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'faq' })
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column('text')
  answer: string;
}
