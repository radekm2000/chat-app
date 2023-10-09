import { Socket } from 'socket.io';
import { WsJwtGuard } from '../ws-jwt/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';
type SocketIoMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIoMiddleware => {
  return async (client, next) => {
    const wsGuard = new WsJwtGuard(new JwtService());
    try {
      const payload = await wsGuard.validateToken(client);

      const user = {
        userId: payload.id,
        socketId: client.id,
      };
      client.user = user;
      next();
    } catch (error) {
      console.log('wiadomosc errora');
      console.log(error?.message);
      client.emit('error', 'jwt_malformed');
      next(error);
    }
  };
};
