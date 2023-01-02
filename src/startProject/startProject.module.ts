import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { StartProjectService } from './startProject.service';
import { RequestUonModule } from 'src/request-uon/request-uon.module';

@Module({
  providers: [StartProjectService],
  imports: [AccountsModule, RequestUonModule],
})
export class StartProjectModule {}
