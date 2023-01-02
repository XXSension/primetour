import { forwardRef, Module } from '@nestjs/common';
import { RequestAmoService } from './request-amo.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AuthModule } from 'src/auth/auth.module';
import { StartProjectModule } from 'src/startProject/startProject.module';

@Module({
  imports: [AccountsModule, AuthModule, forwardRef(() => StartProjectModule)],
  providers: [RequestAmoService],
  exports: [RequestAmoService],
})
export class RequestAmoModule {}
