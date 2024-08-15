import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DayOfWeek } from "src/enums/day-week.enum";
import { TypeTicket } from "src/enums/type-ticket.enum";
import { CreateOpeningHourDto } from "src/modules/opening-hours/dto/create-opening-hour.dto";
import { CreateTicketDto } from "src/modules/tickets/dto/create-ticket.dto";

const tickets: Array<CreateTicketDto> = [
    {
        link: 'https://exemplo.com/compra-inteira',
        type: TypeTicket.inteira,
        value: '50,00'
    },
    {
        link: 'https://exemplo.com/compra-inteira',
        type: TypeTicket.meia,
        value: '25,00'
    }
]

const openingHours: Array<CreateOpeningHourDto> = [
    {
        dayOfWeek: DayOfWeek.domingo,
        endTime: '20:00',
        startTime: '10:00',
    },
    {
        dayOfWeek: DayOfWeek.sabado,
        endTime: '20:00',
        startTime: '10:00',
    },
]

export class CreateLocationDto {
    id?: string;

    @ApiProperty({
        description: 'Insira o nome do ponto turistico ou evento',
        default: 'Di Roma Aqua Parque'
    })
    name: string;

    @ApiPropertyOptional({
        type: Array<CreateOpeningHourDto>,
        default: openingHours
    })
    openingHours?: Array<CreateOpeningHourDto>;
    
    @ApiPropertyOptional({
        type: Array<CreateLocationDto>,
        default: tickets
    })
    tickets: Array<CreateTicketDto>;

    @ApiProperty({
        description: 'Insira o endereço',
        default: 'Rua José da Rosa Pena'
    })
    address: string;

    @ApiProperty({
        description: 'Insira o CEP',
        default: '75705-020'
    })
    zipCode: string;

    @ApiProperty({
        description: 'Insira a cidade',
        default: 'Catalão'
    })
    city: string;

    @ApiProperty({
        description: 'Insira o Estado',
        default: 'Goiás'
    })
    state: string;

    @ApiProperty({
        description: 'Insira a descrição do evento ou ponto turistico',
        default: 'Exemplo da descrição do evento ou ponto turistico'
    })
    description: string;

    @ApiPropertyOptional({
        description: 'Insira a taxa de admissão',
        default: true
    })
    admissionFee: boolean;

    @ApiPropertyOptional({
        description: 'Insira as urls das imagens',
        default: ['https://url-da-imagem.png']
    })
    images: Array<string>;
}