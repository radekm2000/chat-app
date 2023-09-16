import { Module } from '@nestjs/common';
import { MyGateway } from './gateway/gateway';
import { GatewayModule } from './gateway/gateway.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [GatewayModule, AuthModule, UsersModule],
  controllers: [],
  providers: [MyGateway],
})
export class AppModule {}
