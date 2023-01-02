import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appeal } from './entities/appeal.entity';

@Injectable()
export class AppealService {
  constructor(
    @InjectRepository(Appeal)
    private appealRepo: Repository<Appeal>,
  ) {}

  create(data: Partial<Appeal>): Promise<Appeal> {
    return this.appealRepo.save(data);
  }

  findById(id_system: number): Promise<Appeal> {
    return this.appealRepo.findOne({ where: { id_system: id_system } });
  }

  findAllAppeal(): Promise<Array<Appeal>> {
    return this.appealRepo.find();
  }
}
