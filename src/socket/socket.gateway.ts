import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MessagesService } from "src/messages/messages.service";
import { Message } from "../../generated/prisma";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private connectedClients = new Map<string, Socket>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagesService: MessagesService
  ) { }

  afterInit() {
    // Gateway initialized
    console.log("Gateway initialized");
  }

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token || client.handshake.headers.auth;

    if (token) {
      try {
        const bearerToken = token;
        const decoded = this.jwtService.verify(bearerToken);
        client.data.user = decoded;
        this.connectedClients.set(client.id, client);
        client.emit('connected', {
          message: 'Connected',
          userId: decoded.sub,
        });

        console.log('Client connected:', client.id);
      } catch {
        client.disconnect();

        console.log('Invalid token:', token);
      }
    } else {
      this.connectedClients.set(client.id, client);
      client.emit('connected', { message: 'Connected (unauthenticated)' });
      console.log('Client connected (unauthenticated):', client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);

    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    let savedMessage: any = null;

    if (client.data.user) {
      try {
        savedMessage = await this.messagesService.create(
          data.text,
          client.data.user.sub
        );
      } catch (error) {
        console.log("Error saving message:", error);
      }
    }

    client.broadcast.emit('message', {
      id: savedMessage?.id,
      from: client.id,
      user: client.data.user?.email || 'Anonymous',
      text: data.text,
      timestamp: new Date(),
    });
    return { status: 'ok', messageId: savedMessage?.id };
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('typing', {
      from: client.id,
      user: client.data.user?.email || 'Anonymous',
      isTyping: data.isTyping,
    });
    return { status: 'ok' };
  }

  @SubscribeMessage('direct-message')
  async handleDirectMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    const targetClient = this.connectedClients.get(data.targetId);
    let savedMessage: any = null;


    if (client.data.user) {
      try {
        const text = data.text;
        const senderId = client.data.user.sub;
        savedMessage = await this.messagesService.create(text, senderId);
      } catch (error) {
        console.log("Error saving message:", error);
      }
    }

    if (targetClient) {
      targetClient.emit('direct-message', {
        id: savedMessage?.id,
        from: client.id,
        user: client.data.user?.email || 'Anonymous',
        text: data.text,
        timestamp: new Date(),
      });
      return { status: 'sent', targetId: data.targetId, messageId: savedMessage?.id };
    }
    return { status: 'error', message: 'Target not found' };
  }

  @SubscribeMessage("get-users")
  handleGetUsers(@ConnectedSocket() client: Socket) {
    const users = Array.from(this.connectedClients.values()).map((c) => ({
      id: c.id,
      email: c.data.user?.email || 'Anonymous',
    }));
    return { status: 'ok', users };
  }
}
