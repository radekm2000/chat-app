import { Module } from '@nestjs/common';
// import { MyGateway } from './gateway/gateway';
import { GatewayModule } from './gateway/gateway.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'ormconfig';

@Module({
  imports: [
    GatewayModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(config),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
