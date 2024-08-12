import { PartialType } from '@nestjs/swagger';
import { CreateTouristAttractionDto } from './create-tourist-attraction.dto';

export class UpdateTouristAttractionDto extends PartialType(CreateTouristAttractionDto) {}
