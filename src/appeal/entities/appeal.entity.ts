import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'appeal',
})
export class Appeal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_system: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  telephone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  budget: number;

  @Column({ nullable: true })
  desired_date_from: string;

  @Column({ nullable: true })
  desired_date_before: string;

  @Column({ nullable: true })
  desired_number_of_nights: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  notes: string;
}
