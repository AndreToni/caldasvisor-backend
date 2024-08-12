import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateLocationDto } from "src/dtos/create-location.dto";
import { Location } from "src/entities/location.entity";
import { DayOfWeek } from "src/enums/day-week.enum";

export class CreateOpeningHourDto {
    id?: number;

    @ApiProperty({
        description: 'Inserir o dia da semana',
        default: DayOfWeek.domingo,
        enum: DayOfWeek
    })
    dayOfWeek: DayOfWeek;

    @ApiPropertyOptional({
        description: 'Inserir data do horário',
        default: new Date()
    })
    date?: Date;

    @ApiPropertyOptional({
        description: 'Inserir descrição do horário',
        default: 'Concentração e Café da manhã'
    })
    description?: string;

    @ApiProperty({
        description: 'Inserir o horário inicial',
        default: '18:00'
    })
    startTime: string;

    @ApiProperty({
        description: 'Inserir o horário final',
        default: '20:00'
    })
    endTime: string;

    @ApiPropertyOptional({
        description: 'Inserir o id do evento ou ponto de turismo',
    })
    touristAttractionId?: string;
    
    @ApiPropertyOptional({
        description: 'Inserir o id do evento ou ponto de turismo',
    })
    eventId?: string;
}
