import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { config } from './config';
import { StartProjectModule } from './startProject/startProject.module';
import { RequestAmoModule } from './request-amo/request-amo.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestUonModule } from './request-uon/request-uon.module';
import { AppealModule } from './appeal/appeal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db.onix-tech.ru',
      port: 3306,
      username: 'timur',
      database: 'report_to_telegram_timur',
      password: 'q@FqYM(krB!36V1n',
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
    }),
    AccountsModule,
    StartProjectModule,
    RequestAmoModule,
    ScheduleModule.forRoot(),
    RequestUonModule,
    AppealModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
