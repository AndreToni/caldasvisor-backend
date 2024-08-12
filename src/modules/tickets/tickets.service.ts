import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private repository: Repository<Ticket>
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      const {eventId, touristAttractionId} = createTicketDto;

      const ticket = await this.repository.save({
        ...createTicketDto,
        value: createTicketDto.value.replace(/[^0-9]/g, ''),
        touristAttraction: touristAttractionId ? {
          id: createTicketDto?.touristAttractionId
        } : null,
        event: eventId ? {
          id: createTicketDto?.eventId
        } : null
      });
      
      return {
        success: true,
        ticket
      };
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
      if(!exists) throw new Error('Ingresso não foi encontrado.');

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

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    try {
      const exists = await this.repository.findOne({where: {id}});
      if(!exists) throw new Error('Ingresso não foi encontrado.');

      await this.repository.update(id, updateTicketDto);

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
