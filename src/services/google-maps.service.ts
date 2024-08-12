import { Client, PlaceAutocompleteResult, GeocodeResult, AddressType } from "@googlemaps/google-maps-services-js";
import { Injectable } from "@nestjs/common";

export interface Place {
    formatted_address: string;
    place_id: string;
    location?: {
        lat: number,
        lng: number,
    },
    country?: string;
    state?: string;
    city: string;
    district?: string;
    route?: string;
    number?: string;
}

@Injectable()
export class GoogleMapsService {
    client: Client;
    key: string;
    constructor() {
        this.client = new Client({});
        this.key = process.env.GOOGLE_MAPS_KEY
    }

    async findPlace(address: string, place_id?: string) {
        try {
            const res = await this.client.geocode({
                params: {
                    address: address,
                    place_id: place_id,
                    language: 'pt_BR',
                    key: 'AIzaSyAL0nuiivYbmYXOpquhfaWu3mO7g2szsQ0',
                    components: {
                        country: 'BR',
                        administrative_area: 'GO'
                    }
                }
            }).then(res => res.data);

            const results = res.results.map(item => this.convertGeocodeInPlace(item));

            return {
                success: true,
                results,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
    
    async findPlaceById(place_id?: string) {
        try {
            const res = await this.client.geocode({
                params: {
                    place_id: place_id,
                    language: 'pt_BR',
                    key: 'AIzaSyAL0nuiivYbmYXOpquhfaWu3mO7g2szsQ0',
                    components: {
                        country: 'BR',
                        administrative_area: 'GO'
                    }
                }
            }).then(res => res.data);

            const results = res.results.map(item => this.convertGeocodeInPlace(item));

            return {
                success: true,
                results,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
    
    async autocomplete(input: string) {
        try {
            const res = await this.client.placeAutocomplete({
                params: {
                    input: input,
                    language: 'pt_BR',
                    key: 'AIzaSyAL0nuiivYbmYXOpquhfaWu3mO7g2szsQ0',
                }
            }).then(res => res.data);

            const results = res.predictions.map(item => this.convertAutocompleteInPlace(item));

            return {
                success: true,
                results,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    convertGeocodeInPlace(result: GeocodeResult): Place {
        const formatted_address = result.formatted_address;
        const location = result.geometry.location;
        const country = result.address_components.find(item => item.types.includes(AddressType.country))?.long_name;
        const state = result.address_components.find(item => item.types.includes(AddressType.administrative_area_level_1))?.long_name;
        const city = result.address_components.find(item => item.types.includes(AddressType.administrative_area_level_2))?.long_name;
        const district = result.address_components.find(item => item.types.includes(AddressType.sublocality_level_1))?.long_name;
        const route = result.address_components.find(item => item.types.includes(AddressType.route))?.long_name;
        const number = result.address_components.find(item => item.types.includes(AddressType.street_number))?.long_name;
        const place_id = result.place_id;

        return {
            place_id,
            city,
            country,
            district,
            formatted_address,
            location,
            number,
            route,
            state
        }
    }
    
    convertAutocompleteInPlace(result: PlaceAutocompleteResult) {
        const formatted_address = result.description;
        const place_id = result.place_id;

        return {
            formatted_address,
            place_id,
        }
    }
}