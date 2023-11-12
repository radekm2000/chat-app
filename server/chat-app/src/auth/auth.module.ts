import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from 'src/users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ResetPasswordToken } from 'src/utils/entities/resetPasswordToken.entity';
import { TokensService } from 'src/tokens/tokens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResetPasswordToken]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  providers: [
    AuthService,
    TokensService,
    UsersService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
