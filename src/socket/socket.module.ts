import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { JwtModule } from "@nestjs/jwt";
import { MessagesModule } from "src/messages/messages.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? "3600") },
    }),
    MessagesModule,
  ],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
