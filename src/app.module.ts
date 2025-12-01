import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { MessagesModule } from "./messages/messages.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { LoggerModule } from "./logger/logger.module";
import { AuthModule } from "./auth/auth.module";
import { SocketModule } from "./socket/socket.module";
import { validate } from "./config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ".env",
    }),
    UsersModule,
    DatabaseModule,
    MessagesModule,
    ThrottlerModule.forRoot([
      {
        name: "Short",
        ttl: 1000,
        limit: 1,
      },
      {
        name: "Long",
        ttl: 60000,
        limit: 5,
      },
    ]),
    LoggerModule,
    AuthModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
