import { Module } from '@nestjs/common';
import { RequestUonService } from './request-uon.service';
import { AppealModule } from '../appeal/appeal.module';
import { RequestAmoModule } from 'src/request-amo/request-amo.module';

@Module({
  imports: [AppealModule, RequestAmoModule],
  providers: [RequestUonService],
  exports: [RequestUonService],
})
export class RequestUonModule {}
