import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    ThrottlerModule.forRoot([{
      name: 'Short',
      ttl: 1000,
      limit: 1,
    }, {
      name: 'Long',
      ttl: 60000,
      limit: 5,
    }]),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
