import { Controller, Get, Delete, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.messagesService.findByUserId(+userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.messagesService.deleteMessage(+id);
  }
}
