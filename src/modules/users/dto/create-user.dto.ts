import { ApiProperty } from '@nestjs/swagger';
import { TypeUser } from 'src/enums/type-user.enum';

export class CreateUserDto {
    @ApiProperty({
        description: 'Inserir o nome do usuário',
        default: 'André Tonim'
    })
    name: string;

    @ApiProperty({
        description: 'Inserir o email do usuário',
        default: 'andre@gmail.com'
    })
    email: string;

    @ApiProperty({
        description: 'Inserir a senha do usuário',
        default: '12345678'
    })
    password: string;
    
    @ApiProperty({
        description: 'Inserir a senha do usuário',
        default: TypeUser.customer,
        enum: TypeUser
    })
    type: TypeUser;

    @ApiProperty({
        description: 'Inserir o nome da empresa',
        default: 'Nome da Empresa'
    })
    companyName: string;

    @ApiProperty({
        description: 'Inserir o documento da empresa(cpf ou cnpj)',
        default: '000.000.000-00'
    })
    companyDocument: string;

    @ApiProperty({
        description: 'Inserir o cep',
        default: '75000-000'
    })
    cep: string;

    @ApiProperty({
        description: 'Inserir o Estado',
        default: 'Goiás'
    })
    state: string;

    @ApiProperty({
        description: 'Inserir a cidade',
        default: 'Caldas Novas'
    })
    city: string;

    @ApiProperty({
        description: 'Inserir o endereço',
        default: 'Rua José da Pena'
    })
    address: string;
}
