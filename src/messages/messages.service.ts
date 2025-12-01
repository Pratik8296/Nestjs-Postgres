import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(text: string, senderId: number) {

    console.log(senderId, text, "-----------------------------------------");

    return this.prismaService.message.create({
      data: {
        text: text,
        senderId: senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prismaService.message.findMany({
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prismaService.message.findMany({
      where: {
        senderId: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteMessage(messageId: number) {
    return this.prismaService.message.delete({
      where: {
        id: messageId,
      },
    });
  }
}
