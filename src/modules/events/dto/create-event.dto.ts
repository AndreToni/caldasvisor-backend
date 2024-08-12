import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateLocationDto } from "src/dtos/create-location.dto";

export class CreateEventDto extends CreateLocationDto {
    @ApiPropertyOptional({
        description: 'Insira os patrocinadores',
        default: 'Exemplo dos patrocinadores'
    })
    sponsors: string;
}
