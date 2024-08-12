import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginatedDto } from "src/dtos/paginated.dto";
import { TypeUser } from "src/enums/type-user.enum";

export class FindUserDto extends PaginatedDto {
    @ApiPropertyOptional()
    active?: boolean;
    
    @ApiPropertyOptional()
    type: TypeUser;
}