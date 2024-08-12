import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { GoogleMapsService } from './services/google-maps.service';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindPlaceDto {
    @ApiProperty({
        description: 'Insira aqui o valor de busca como um cep ou endereço',
        default: '75705-080'
    })
    input: string;
}
export class FindPlaceIdDto {
    @ApiProperty({
        description: 'Insira aqui o valor de busca como um cep ou endereço',
        default: '75705-080'
    })
    input: string;
    
    @ApiPropertyOptional({
        description: 'Insira aqui o id gerado pela api do google do lugar',
        default: 'ChIJLfLnHwRmppQRYpP9tS0dkBU'
    })
    place_id: string;
}

@Controller()
export class AppController {
    constructor(private googleMapsService: GoogleMapsService) {}

    @Post('places/geocode')
    findPlace(@Body() {input}: FindPlaceDto) {
        return this.googleMapsService.findPlace(decodeURIComponent(input)) 
    }
    
    @Get('places/geocode/:place_id')
    findPlaceId(@Param('place_id') place_id: string) {
        return this.googleMapsService.findPlaceById(place_id) 
    }
    
    @Post('places/autocomplete')
    autocomplete(@Body() {input}: FindPlaceDto) {
        return this.googleMapsService.autocomplete(decodeURIComponent(input)) 
    }
}
