import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/ws-middleware.ts/ws.middleware';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log(`user with id ${socket.id} connected`);
    });
  }

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    console.log('after init ');
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() data: any): any {
    this.server.emit('onMessage', {
      msg: 'new Message',
      content: data,
    });
  }
}
