import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PaginatedDto {
  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  page?: number;
}
