import { Module } from '@nestjs/common';
import { OpeningHoursService } from './opening-hours.service';
import { OpeningHoursController } from './opening-hours.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpeningHour } from './entities/opening-hour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OpeningHour])],
  controllers: [OpeningHoursController],
  providers: [OpeningHoursService],
  exports: [OpeningHoursService]
})
export class OpeningHoursModule {}
