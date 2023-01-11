import { forwardRef, Module } from '@nestjs/common';
import { RequestAmoService } from './request-amo.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { StartProjectModule } from 'src/startProject/startProject.module';

@Module({
  imports: [AccountsModule, forwardRef(() => StartProjectModule)],
  providers: [RequestAmoService],
  exports: [RequestAmoService],
})
export class RequestAmoModule {}
