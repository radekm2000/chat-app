import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`user with id ${socket.id} connected`);
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() data: any): any {
    this.server.emit('onMessage', {
      msg: 'new Message',
      content: data,
    });
  }
}
