import { Injectable } from '@nestjs/common';
import { CreateOpeningHourDto } from './dto/create-opening-hour.dto';
import { UpdateOpeningHourDto } from './dto/update-opening-hour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OpeningHour } from './entities/opening-hour.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpeningHoursService {
  constructor(
    @InjectRepository(OpeningHour) private repository: Repository<OpeningHour>
  ) {}
  
  async create(createOpeningHourDto: CreateOpeningHourDto) {
    try {
      const {eventId, touristAttractionId} = createOpeningHourDto;

      const openingHour = this.repository.create({
        ...createOpeningHourDto,
        touristAttraction: touristAttractionId ? {
          id: createOpeningHourDto?.touristAttractionId
        } : null,
        event: eventId ? {
          id: createOpeningHourDto?.eventId
        } : null
      });
      
      return {
        success: true,
        result: await this.repository.save(openingHour)
      }
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: error.message 
      }
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: number) {
    try {
      const exists = await this.repository.findOne({where: {id}});
      if(!exists) throw new Error('Horario de funcionamento não foi encontrado.');

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

  async update(id: number, updateOpeningHourDto: UpdateOpeningHourDto) {
    try {
      const exists = await this.repository.findOne({where: {id}});
      if(!exists) throw new Error('Ingresso não foi encontrado.');

      await this.repository.update(id, updateOpeningHourDto);

      return {
        success: true,
        message: 'Ingresso atualizado com sucesso',
        result: await this.repository.findOne({where: {id}})
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: number) {
    try {
      const exists = await this.repository.findOne({where: {id}});
      if(!exists) throw new Error('Evento não foi encontrado.');

      await this.repository.delete(id);

      return {
        success: true,
        message: 'Ingresso removido com sucesso',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
