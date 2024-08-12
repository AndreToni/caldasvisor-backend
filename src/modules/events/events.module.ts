import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { OpeningHoursModule } from '../opening-hours/opening-hours.module';
import { TicketsModule } from '../tickets/tickets.module';
import { GoogleMapsService } from 'src/services/google-maps.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), OpeningHoursModule, TicketsModule,],
  controllers: [EventsController],
  providers: [EventsService, GoogleMapsService],
})
export class EventsModule {}
