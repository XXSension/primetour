import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RequestUonService } from 'src/request-uon/request-uon.service';

@Injectable()
export class StartProjectService {
  logger: Logger;
  constructor(private requestUonService: RequestUonService) {
    this.logger = new Logger();
  }

  @Cron('0 */10 * * * *')
  async onModuleInit(): Promise<void> {
    console.log(Math.round(Number(new Date()) / 1000) + 86400);
    await this.requestUonService.checkDataAppeal();
  }
}
