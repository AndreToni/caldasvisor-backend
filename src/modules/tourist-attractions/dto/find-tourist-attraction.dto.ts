import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginatedDto } from "src/dtos/paginated.dto";

export class FindTouristAttractionDto extends PaginatedDto {
    @ApiPropertyOptional()
    organizer?: string;

    @ApiPropertyOptional()
    input?: string;
}