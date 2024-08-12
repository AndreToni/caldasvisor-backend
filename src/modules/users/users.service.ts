import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TypeUser } from 'src/enums/type-user.enum';
import { hashSync } from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      //Verifica se usuário com o email informado já existe
      const userAlreadyExists = await this.repository.findOneBy({ email: createUserDto.email });
      if (userAlreadyExists) throw new Error(`Usuário com o email ${createUserDto.email} já existe`);

      //Verifica se o tipo de usuário é diferente de admin e que o tipo de usuário existe
      if (createUserDto.type == TypeUser.admin) throw new Error('Você não tem permissão para criar esse tipo de usuário');
      if (!TypeUser[createUserDto.type]) throw new Error(`Tipo de usuário ${createUserDto.type} não existe`);

      //Cria uma instancia de User pra logo abaixo salvar no banco de dados
      const user = this.repository.create({ ...createUserDto });

      return {
        success: true,
        message: 'Usuário criado com sucesso.',
        result: await this.repository.save(user)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(query: FindUserDto) {
    try {
      const {limit, page} = query;
      const [results, total] = await this.repository.findAndCount({
        where: {type: query?.type},
        select: {
          id: true,
          name: true,
          email: true,
          type: true,
          address: true,
          cep: true,
          city: true,
          companyDocument: true,
          companyName: true,
          state: true,
          active: true,
        },
        take: limit ?? 16,
        skip: page ? (limit ?? 16) * (page - 1) : 0,
      },);
      return {
        success: true,
        results,
        total,
        totalPages: total > 0 ? Math.ceil(total / (limit ?? 16)) : 0,
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
      const userAlreadyExists = await this.repository.findOne({
        where: { id },
      });
      if (!userAlreadyExists) throw new Error('Usuário não existe');

      return {
        success: true,
        result: userAlreadyExists
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOneByEmail(email: string) {
    try {
      const userAlreadyExists = await this.repository.findOneBy({ email });
      if (!userAlreadyExists) return null;

      return userAlreadyExists
    } catch (error) {
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.type && updateUserDto.type == TypeUser.admin) throw new Error('Você não tem permissão para criar esse tipo de usuário');
      if (updateUserDto.type && !TypeUser[updateUserDto.type]) throw new Error(`Tipo de usuário ${updateUserDto.type} não existe`);

      const userAlreadyExists = await this.repository.findOne({ where: { id }, select: { id: true, name: true, email: true, type: true } });
      if (!userAlreadyExists) throw new Error('Usuário não existe');

      await this.repository.update(id, updateUserDto);

      return {
        success: true,
        result: await this.repository.findOne({ where: { id }, select: { id: true, name: true, email: true, type: true } })
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async changeActive(id: string, active: boolean) {
    try {
      const userAlreadyExists = await this.repository.findOne({ where: { id }, select: { id: true, name: true, email: true, type: true } });
      if (!userAlreadyExists) throw new Error('Usuário não existe');

      await this.repository.update(id, {active});

      return {
        success: true,
        result: await this.repository.findOne({ where: { id }, select: { id: true, name: true, email: true, type: true } })
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async updatePassword(id: string, password: string) {
    try {
      const userAlreadyExists = await this.repository.findOne({ where: { id }, select: { id: true, name: true, email: true, type: true } });
      if (!userAlreadyExists) throw new Error('Usuário não existe');

      const passwordHash = hashSync(password, 10);

      await this.repository.update(id, {password: passwordHash});

      return {
        success: true,
        result: await this.repository.findOne({ where: { id }, select: { id: true, name: true, email: true, type: true } })
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
      const userAlreadyExists = await this.repository.findOne({ where: { id }, select: { id: true, name: true, email: true, type: true } });
      if (!userAlreadyExists) throw new Error('Usuário não existe');

      await this.repository.delete(id);

      return {
        success: true,
        message: 'Usuário removido com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
