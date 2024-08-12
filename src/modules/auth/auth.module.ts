import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { NodemailerService } from 'src/services/nodemailer.service';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, NodemailerService]
})
export class AuthModule {}
