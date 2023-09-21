import { Socket } from 'socket.io';
import { WsJwtGuard } from '../ws-jwt/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
type SocketIoMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIoMiddleware => {
  return (client, next) => {
    const wsGuard = new WsJwtGuard(new JwtService());
    try {
      wsGuard.validateToken(client);
      next();
    } catch (error) {
      const err = new HttpException(
        'Authorization failed',
        HttpStatus.UNAUTHORIZED,
      );
      next(err);
    }
  };
};
