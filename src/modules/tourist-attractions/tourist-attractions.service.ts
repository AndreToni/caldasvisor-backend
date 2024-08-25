import { Injectable } from '@nestjs/common';
import { CreateTouristAttractionDto } from './dto/create-tourist-attraction.dto';
import { UpdateTouristAttractionDto } from './dto/update-tourist-attraction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TouristAttraction } from './entities/tourist-attraction.entity';
import { Like, Repository } from 'typeorm';
import { TicketsService } from '../tickets/tickets.service';
import { OpeningHoursService } from '../opening-hours/opening-hours.service';
import { FindTouristAttractionDto } from './dto/find-tourist-attraction.dto';
import { User } from '../users/entities/user.entity';
import { GoogleMapsService } from 'src/services/google-maps.service';

@Injectable()
export class TouristAttractionsService {
  constructor(
    @InjectRepository(TouristAttraction) private repository: Repository<TouristAttraction>,
    private ticketsService: TicketsService,
    private openingHoursService: OpeningHoursService,
    private googleMapsService: GoogleMapsService
  ) {}
  
  async create(createTouristAttractionDto: CreateTouristAttractionDto, user: User) {
    try {
      const {openingHours, tickets, address, zipCode, ...data} = createTouristAttractionDto;
      const { city, location, district, state, route, number } = await this.googleMapsService.findPlace(`${address}, ${zipCode}`).then(res => res?.results[0] ?? null);
      const formattedAddress = [
        route,
        number && `, ${number}`,
        district && ` - ${district}`
      ].filter(Boolean).join('');

      const touristAttraction = await this.repository.save({
        ...data, 
        lat: location.lat,
        lng: location.lng,
        zipCode,
        address: formattedAddress,
        city: city,
        state: state,
        organizer: user
      });

      if(touristAttraction && openingHours) {
        for(let i = 0; i < openingHours.length; i++) {
          await this.openingHoursService.create({
            ...openingHours[i],
            touristAttractionId: touristAttraction.id
          })
        }
      }
      
      if(touristAttraction && tickets) {
        for(let i = 0; i < tickets.length; i++) {
          await this.ticketsService.create({
            ...tickets[i],
            touristAttractionId: touristAttraction.id
          })
        }
      }

      return {
        success: true,
        result: await this.repository.findOne({
          where: {id: touristAttraction.id},
          relations: ['openingHours', 'tickets']
        })
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(query: FindTouristAttractionDto) {
    try {
      const {limit, page, organizer, input} = query;
      const [results, total] = await this.repository.findAndCount({
        where: {organizer: {id: organizer}, name: input && Like(`%${input}%`)},
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
      if(!exists) throw new Error('Ponto turístico não foi encontrado.');

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

  async update(id: string, updateTouristAttractionDto: UpdateTouristAttractionDto) {
    try {
      const exists = await this.repository.findOne({
        where: {id},
        relations: ['openingHours', 'tickets', 'organizer'] 
      });
      if(!exists) throw new Error('Ponto turístico não foi encontrado.');

      const {openingHours, tickets, address, zipCode, ...data} = updateTouristAttractionDto;
      const { city, location, district, state, route, number } = await this.googleMapsService.findPlace(`${address}, ${zipCode}`).then(res => res?.results[0] ?? null);
      const formattedAddress = [
        route,
        number && `, ${number}`,
        district && ` - ${district}`
      ].filter(Boolean).join('');

       await this.repository.update(id, {
        ...data,
        lat: location.lat,
        lng: location.lng,
        zipCode,
        address: formattedAddress,
        city: city,
        state: state,
        organizer: exists.organizer
      });

      
      if(openingHours) {
        for(let i = 0; i < openingHours.length; i++) {
          if(openingHours[i].id) {
            await this.openingHoursService.update(openingHours[i].id, {
              ...openingHours[i],
              touristAttractionId: exists.id
            });
          } else {
            await this.openingHoursService.create({
              ...openingHours[i],
              touristAttractionId: exists.id
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
              touristAttractionId: exists.id
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
      if(!exists) throw new Error('Ponto turístico não foi encontrado.');

      await this.repository.delete(id);

      return {
        success: true,
        message: 'Ponto turístico removido com sucesso.',
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
      if(!exists) throw new Error('Ponto turístico não foi encontrado.');

      exists.images = exists.images ? [...exists.images, file.path] : [file.path];

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

  async removeFile(id: string, path: string) {
    try {
      const exists = await this.repository.findOne({
        where: {id}, 
      });
      if(!exists) throw new Error('Ponto turístico não foi encontrado.');

      exists.images = exists.images?.filter(item => item != path);

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
