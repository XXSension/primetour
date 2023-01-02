import { Module } from '@nestjs/common';
import { AppealService } from './appeal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appeal } from './entities/appeal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appeal])],
  providers: [AppealService],
  exports: [AppealService],
})
export class AppealModule {}
