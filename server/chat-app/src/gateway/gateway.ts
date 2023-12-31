import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/ws-middleware.ts/ws.middleware';
import { WebsocketUserType } from 'src/utils/types/types';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'https://radekm-chat-app.netlify.app'],
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class MyGateway {
  private onlineUsers: WebsocketUserType[] = [];
  constructor() {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log(`user with id ${socket.id} connected`);
      if (
        !this.onlineUsers.find((user) => user.userId === socket.user.userId)
      ) {
        this.onlineUsers.push(socket.user);
      }
      console.log('online users:', this.onlineUsers);

      this.server.emit('getOnlineUsers', this.onlineUsers);
      socket.on('disconnect', () => {
        console.log(
          `user z id ${socket.user.userId} with  sokcket id ${socket.id} disconnected`,
        );
        this.onlineUsers = this.onlineUsers.filter(
          (user) => user.userId !== socket.user.userId,
        );
        console.log(this.onlineUsers);
        this.server.emit('getOnlineUsers', this.onlineUsers);
      });

      socket.on('sendMessage', ({ msg, recipientId }) => {
        console.log('dane na sendMessage');
        console.log(msg, recipientId);
        const user = this.onlineUsers.find(
          (user) => user.userId === recipientId,
        );
        if (!user) {
          return;
        }
        console.log('wysylane do user soket id : ');
        console.log(user.socketId);

        this.server.to(user.socketId).emit('getMessage', msg);
        this.server.to(user.socketId).emit('getNotification', {
          senderId: msg?.author?.id,
          isRead: false,
          date: new Date(),
        });
      });

      socket.on('typingMessage', ({ authorId, conversationId }) => {
        const typingMsg = 'is typing...';
        this.server.emit('typingMessage', {
          typingMsg,
          authorId,
          conversationId,
        });
      });

      socket.on('noLongerTypingMessage', () => {
        this.server.emit('noLongerTypingMessage', () => {});
      });
    });
  }

  afterInit(client: Socket) {
    console.log('after initt ');
    client.use(SocketAuthMiddleware() as any);
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() data: any): any {
    this.server.emit('onMessage', {
      msg: 'new Message',
      content: data,
    });
  }
}
