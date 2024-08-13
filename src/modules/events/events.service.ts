import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { TicketsService } from '../tickets/tickets.service';
import { OpeningHoursService } from '../opening-hours/opening-hours.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Like, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { FindEventsDto } from './dto/find-events.dto';
import { GoogleMapsService } from 'src/services/google-maps.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private repository: Repository<Event>,
    private ticketsService: TicketsService,
    private openingHoursService: OpeningHoursService,
    private googleMapsService: GoogleMapsService
  ) { }

  async create(createEventDto: CreateEventDto, user: User) {
    try {
      const { openingHours, tickets, zipCode, ...data } = createEventDto;
      const address = await this.googleMapsService.findPlace(decodeURIComponent(zipCode.toString())).then(res => res?.results[0] ?? null);

      const event = await this.repository.save({ 
        ...data, 
        lat: address?.location.lat, 
        lng: address?.location.lng,
        zipCode,
        address: address.formatted_address,
        city: address.city,
        state: address.state,
        organizer: user 
      });

      if (event && openingHours) {
        for (let i = 0; i < openingHours.length; i++) {
          await this.openingHoursService.create({
            ...openingHours[i],
            eventId: event.id
          })
        }
      }

      if (event && tickets) {
        for (let i = 0; i < tickets.length; i++) {
          await this.ticketsService.create({
            ...tickets[i],
            eventId: event.id
          })
        }
      }

      return {
        success: true,
        result: await this.repository.findOne({
          where: { id: event.id },
          relations: ['openingHours', 'tickets', 'organizer']
        })
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(query: FindEventsDto) {
    try {
      const { limit, page, organizer, input } = query;
      const [results, total] = await this.repository.findAndCount({
        where: { organizer: { id: organizer }, name: input && Like(`%${input}%`) },
        relations: ['openingHours', 'tickets', 'organizer'],
        take: (limit ?? 8),
        skip: ((page ?? 1) - 1) * (limit ?? 8),
        select: {
          organizer: {
            id: true,
            name: true,
            email: true,
          }
        }
      });

      return {
        success: true,
        results,
        total,
        page: +page ?? 1,
        limit: +limit ?? 8
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: string) {
    try {
      const exists = await this.repository.findOne({
        where: {id},
        relations: ['openingHours', 'tickets', 'organizer'] 
      });
      if(!exists) throw new Error('Evento não foi encontrado.');

      return {
        success: true,
        result: exists
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: string, updateTouristAttractionDto: UpdateEventDto) {
    try {
      const exists = await this.repository.findOne({
        where: {id},
        relations: ['openingHours', 'tickets', 'organizer'] 
      });
      if(!exists) throw new Error('Evento não foi encontrado.');

      const {openingHours, tickets, zipCode, ...data} = updateTouristAttractionDto;
      const address = await this.googleMapsService.findPlace(decodeURIComponent(zipCode.toString())).then(res => res?.results[0] ?? null);

      await this.repository.update(id, {
        ...data,
        lat: address?.location.lat, 
        lng: address?.location.lng,
        zipCode,
        address: address.formatted_address,
        city: address.city,
        state: address.state,
        organizer: exists.organizer
      });
      
      if(openingHours) {
        for(let i = 0; i < openingHours.length; i++) {
          if(openingHours[i].id) {
            await this.openingHoursService.update(openingHours[i].id, {
              ...openingHours[i],
              eventId: exists.id
            });
          } else {
            await this.openingHoursService.create({
              ...openingHours[i],
              eventId: exists.id
            });
          }
        }
      }
      
      if(tickets) {
        for(let i = 0; i < tickets.length; i++) {
          if(tickets[i].id) {
            await this.ticketsService.update(tickets[i].id, {
              ...tickets[i],
              touristAttractionId: exists.id
            })
          } else {
            await this.ticketsService.create({
              ...tickets[i],
              eventId: exists.id
            })
          }
        }
      }

      return {
        success: true,
        result: exists
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: string) {
    try {
      const exists = await this.repository.findOne({
        where: {id}, 
      });

      if(!exists) throw new Error('Evento não foi encontrado.');

      await this.repository.delete(id);

      return {
        success: true,
        message: 'Evento removido com sucesso.',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async uploadFile(id: string, file: Express.Multer.File) {
    try {
      const exists = await this.repository.findOne({
        where: {id}, 
      });
      if(!exists) throw new Error('Evento não foi encontrado.');

      exists.images = [...exists.images, file.path];

      return {
        success: true,
        message: 'Upload realizado com sucesso.',
        result: await this.repository.save(exists)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
