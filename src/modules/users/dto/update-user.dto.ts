import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {ApiPropertyOptional} from '@nestjs/swagger';
import { TypeUser } from 'src/enums/type-user.enum';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({
        description: 'Inserir o nome do usuário',
        default: 'André Tonim'
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Inserir o email do usuário',
        default: 'andre@gmail.com'
    })
    email: string;

    @ApiPropertyOptional({
        description: 'Inserir a senha do usuário',
        default: '12345678'
    })
    password: string;
    
    @ApiPropertyOptional({
        description: 'Inserir a senha do usuário',
        default: TypeUser.customer,
        enum: TypeUser
    })
    type: TypeUser;
}
