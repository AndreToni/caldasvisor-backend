import { Module } from '@nestjs/common';
import { TouristAttractionsService } from './tourist-attractions.service';
import { TouristAttractionsController } from './tourist-attractions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouristAttraction } from './entities/tourist-attraction.entity';
import { OpeningHoursModule } from '../opening-hours/opening-hours.module';
import { TicketsModule } from '../tickets/tickets.module';
import { GoogleMapsService } from 'src/services/google-maps.service';

@Module({
  imports: [TypeOrmModule.forFeature([TouristAttraction]), OpeningHoursModule, TicketsModule],
  controllers: [TouristAttractionsController],
  providers: [TouristAttractionsService, GoogleMapsService],
})
export class TouristAttractionsModule {}
