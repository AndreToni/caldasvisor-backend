import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginatedDto } from "src/dtos/paginated.dto";

export class FindEventsDto extends PaginatedDto {
    @ApiPropertyOptional()
    organizer?: string;

    @ApiPropertyOptional()
    input?: string;
}