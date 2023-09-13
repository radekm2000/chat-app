import { Module } from '@nestjs/common';
import { MyGateway } from './gateway/gateway';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [],
  providers: [MyGateway],
})
export class AppModule {}
