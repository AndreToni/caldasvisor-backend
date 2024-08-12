import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token) private repository: Repository<Token>
  ) { }

  async create(createTokenDto: CreateTokenDto) {
    try {
      const token = this.repository.create(createTokenDto);

      return {
        success: true,
        result: await this.repository.save(token)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  findAll() {
    return `This action returns all tokens`;
  }

  async findOne(refresh_token: string) {
    try {
      const token = await this.repository.findOne({where: {refresh_token}, relations: ['user']});
      return {
        success: true,
        result: token
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
