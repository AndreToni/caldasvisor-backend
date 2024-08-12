import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { TouristAttractionsModule } from './modules/tourist-attractions/tourist-attractions.module';
import { OpeningHoursModule } from './modules/opening-hours/opening-hours.module';
import { EventsModule } from './modules/events/events.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { GoogleMapsService } from './services/google-maps.service';
import { AddressModule } from './modules/address/address.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', ''),
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TouristAttractionsModule,
    OpeningHoursModule,
    EventsModule,
    TicketsModule,
    AddressModule,
    TokensModule
  ],
  controllers: [AppController],
  providers: [AppService, GoogleMapsService],
})
export class AppModule {}
