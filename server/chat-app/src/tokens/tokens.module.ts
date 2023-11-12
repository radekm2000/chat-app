import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from 'src/utils/entities/resetPasswordToken.entity';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordToken])],
  providers: [TokensService],
  controllers: [TokensController],
})
export class TokensModule {}
